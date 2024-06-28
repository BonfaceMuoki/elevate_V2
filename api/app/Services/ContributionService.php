<?php

namespace App\Services;

use App\Constants;
use Exception;
use Illuminate\Http\Request;
use App\Models\SubscriptionLink;
use DB;
use App\Mail\SendAccesorInviteMail;
use App\Mail\sendReportApprovalMail;
use App\Models\BonusPayment;
use App\Models\Category;
use App\Models\CompanyReceivedPayment;
use App\Models\Contribution;
use App\Models\ContributionPayback;
use App\Models\MasterPayment;
use App\Models\MatrixOption;
use App\Models\Club;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Supplier;
use App\Models\SystemSetting;
use App\Models\TierEarning;
use App\Models\User;
use App\Models\UserIniviteOneTimeLink;
use App\Services\SubscriptionLinksService;
use App\Services\SupplierService;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Mail;

class ContributionService
{

    public function verifyPayment(Request $request)
    {
        try {

            DB::beginTransaction();
            $response = '';
            $payment = $request->payment;
            $payment_arr = json_decode($payment, true);
            $masterPaymentid = ($payment_arr['id']) ? $payment_arr['id'] : '';
            $contributions = $payment_arr['matrix_payments'];
            $bonuses = $payment_arr['bonuses'];
            $masterpay = MasterPayment::findOrFail($masterPaymentid);

            if ($masterpay) {

                $userupdateee = User::where('id', $masterpay->user_id)->first();
                $userupdateee->investment_done = 1;
                $userupdateee->save();

                if ($masterpay->status == "APPROVED") {
                    return response()->json(['message' => "Payment already approved"], 201);
                }
                $masterpay->status = ($request->action == 1) ? 'APPROVED' : 'REJECTED';
                $masterpay->save();
                if (($request->action == 1) && $masterpay->save()) {
                    //close update contributions
                    //update bonuses
                    BonusPayment::where('payment_id', $masterPaymentid)->update(['status' => 'Approved']);
                    //update bonuses
                    //update company payments
                    CompanyReceivedPayment::where('payment_id', $masterPaymentid)->update(['status' => 'Approved']);
                    //update company payments
                    //update contributions
                    Contribution::where('payment_id', $masterPaymentid)->update(['admin_approved' => 'Approved']);
                    foreach ($contributions as $contribution) {
                        $contributiontoup = Contribution::findOrFail($contribution['id']);
                        $contributiontoup->admin_approved = 'Approved';
                        if ($contributiontoup) {
                            $response = $this->progressToNextTier($contributiontoup);
                        }
                    }
                } else {
                }
                $userpaying = User::where("id", $masterpay->user_id)->first();
                //    $mailsend = Mail::to($userpaying->email)->send(new sendReportApprovalMail());
                DB::commit();
            } else {
            }

            return response()->json(['message' => 'Processed successfully', 'data' => $payment_arr['id'], 'reponsedetails' => $response], 201);
        } catch (Exception $ex) {
            DB::rollBack();
            return response()->json(['message' => 'Verification failed.Please contact Admin.' . $ex->getMessage()], 400);
        }
    }
    public function progressToNextTier($contribution, $action = 1)
    {
        //assign payment
        $thistier = MatrixOption::where('id', $contribution->tier_id)->first();
        $assignment_ = $this->assignContributionToAnInvestor($thistier, $contribution->user_id);
        $reposnse = [];
        $reposnse_thisuser = [];

        if ($assignment_) {
            $contributiontoupp = Contribution::findOrFail($contribution->id);
            ///assign payment
            //check the received payments
            $no_of_completed_paybacks = $this->getMyPayBacksCountByConributionObject($contribution);

            //get contribution tier details
            $contribution_tier = MatrixOption::where('id', $contribution->tier_id)->first();
            array_push(
                $reposnse_thisuser,
                [
                    'Completed Paybacks by this user' => $no_of_completed_paybacks,
                    'Expected minimum Progression' => $contribution_tier->minimum_progression_amount,
                    'List of back payments for this user ' => $no_of_completed_paybacks
                ]
            );


            if ($no_of_completed_paybacks > 0) {

                array_push(
                    $reposnse_thisuser,
                    [
                        'if condition 1' => (($no_of_completed_paybacks == $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)),
                        'else  if 2' => (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)),
                        'else if 3' => (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks == $contribution_tier->payback_count) && ($action == 1))

                    ]
                );

                if (($no_of_completed_paybacks == $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                    //progress to nex level
                    $reposnse = $reposnse . 'progressed but receiving';
                    $contributiontoupp->status = 'Progressed But Receiving';
                    $contributiontoupp->save();
                    $nexttier = $this->getNextClubAndTierByContriObject($contribution_tier);

                    $updatethisusereligibility = $this->updateEligibility($contribution->user_id, $nexttier->id, $contribution_tier->id);

                    //migrate the payee incase its not the company and not
                } elseif (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                    //progress to nex level
                    $contributiontoupp->status = 'Progressed But Receiving';
                    $contributiontoupp->save();
                    //migrate the payee incase its not the company and not
                } elseif (($no_of_completed_paybacks >= $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks == $contribution_tier->payback_count) && ($action == 1)) {
                    $contributiontoupp->status = 'Completed';
                    $contributiontoupp->save();
                    $counts = ContributionPayback::where('contribution_id_reciving_payback', $contribution->id)->count();
                    ///get payback totals
                    $tierearning['user_id'] = $contribution->user_id;
                    $tierearning['tier_id'] = $contribution->tier_id;
                    $tierearning['total_earnings_so_far'] = $counts * ($contribution->contribution_amount);
                    $tierearning['subscription_used_amount'] = 0;
                    $tierearning['withdraw_amount'] = 0;
                    $tierearning['status'] = 0;
                    $createdearning = TierEarning::create($tierearning);
                    if ($createdearning) {
                        $user = User::findOrFail($contribution->user_id);
                        $user->eligible_tier = 0;
                        $user->eligibility_for_elible = 0;
                        $user->save();

                        return 'This user has completed this tier and ' . $counts * ($contribution->contribution_amount) . ' are the earnings.';
                    } else {
                        return 'This user has completed this tier and ' . $counts * ($contribution->contribution_amount) . ' failed to be processed.Please contact Admin';
                    }
                    ///move earnings to earnings table
                }
            } elseif ($no_of_completed_paybacks == 0) {

                //migrate the payee incase its not the company and not

                //close migrate the payee incase its not the company and not
            }

            $backpaiduser = $this->getBackPaidUserBasedOnContributionObject($contribution);
            array_push(
                $reposnse_thisuser,
                [
                    'Backpaid User contribution details check ' => $backpaiduser
                ]
            );
            if ($backpaiduser['count'] > 0) {
                $backpaidcontribution = Contribution::where('id', $backpaiduser['backpaiduser']->contribution_id_reciving_payback)->with('user')->first();
                array_push(
                    $reposnse_thisuser,
                    [
                        'Backpaid User contribution details check ' => $backpaiduser,
                        'Has the backpaid users payment approved' => $this->checkIfUserHasPaidForTierandItsApproved($contribution_tier->id, $backpaiduser['backpaiduser']->payee_user_id)
                    ]
                );
                $haspaid = $this->checkIfUserHasPaidForTierandItsApproved($contribution_tier->id, $backpaiduser['backpaiduser']->payee_user_id);
                if ($haspaid == 1) {
                    $reposnseee = $this->progressBackPiadUserToNextTier($backpaidcontribution, 1);
                    array_push(
                        $reposnse_thisuser,
                        ['Progressbackpaiduserresponse' => $reposnseee]
                    );
                    // $reposnse = $reposnse . 'Payment status' . $haspaid . 'Backpaiduserresponse -' . $reposnseee;
                } else {
                    // $reposnse = $reposnse . 'Payment status' . $haspaid . 'Backpaiduser - Found but has not paid' . json_encode($backpaiduser) . 'contritier ' . $contribution_tier->id . 'user cont' . $backpaiduser['backpaiduser']->payee_user_id;
                }
            } else {
                // $reposnse = $reposnse . 'Backpaiduser - Not found. 4' . json_encode($backpaiduser);
            }

            return $reposnse_thisuser;
        }
    }

    public function progressBackPiadUserToNextTier($contribution, $action = 1)
    {
        //assign payment
        $thistier = MatrixOption::where('id', $contribution->tier_id)->first();
        ///assign payment
        //check the received payments
        $no_of_completed_paybacks = $this->getMyPayBacksCountByConributionObject($contribution);
        //get contribution tier details
        $contribution_tier = MatrixOption::where('id', $contribution->tier_id)->first();
        $contributiontoupp = Contribution::findOrFail($contribution->id);
        $reposnse_thisuser = [];
        array_push(
            $reposnse_thisuser,
            [
                'Completed Paybacks by this user' => $no_of_completed_paybacks,
                'Expected minimum Progression' => $contribution_tier->minimum_progression_amount,
                'List of back payments for this user ' => $no_of_completed_paybacks
            ]
        );
        if ($no_of_completed_paybacks > 0) {
            array_push(
                $reposnse_thisuser,
                [
                    'if condition 1' => (($no_of_completed_paybacks == $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)),
                    'else  if 2' => (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)),
                    'else if 3' => (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks == $contribution_tier->payback_count) && ($action == 1))
                ]
            );
            if (($no_of_completed_paybacks == $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                //progress to nex level

                $contributiontoupp->status = 'Progressed But Receiving';
                $contributiontoupp->save();
                $nexttier = $this->getNextClubAndTierByContriObject($contribution_tier);

                $updatethisusereligibility = $this->updateEligibilityForBack($contribution->user_id, $nexttier->id, $contribution_tier->id);
                // $reposnse = $reposnse . 'Backpaiduser Update eligibility ' . $updatethisusereligibility;
                //close migrate the payee incase its not the company and not
                ///progress to next level
                //paid contributor process

                ///paid contributor process
            } elseif (($no_of_completed_paybacks > $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                //progress to nex level
                $contributiontoupp->status = 'Progressed But Receiving';
                $contributiontoupp->save();

                // $reposnse = $reposnse . 'BPU Progressed But Receiving';
            } elseif (($no_of_completed_paybacks < $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks < $contribution_tier->payback_count) && ($action == 1)) {
                //progress to nex level
                // $reposnse = $reposnse . 'BPU not qualified for any action.';
            } elseif (($no_of_completed_paybacks >= $contribution_tier->minimum_progression_count) && ($no_of_completed_paybacks == $contribution_tier->payback_count) && ($action == 1)) {
                $contributiontoupp->status = 'Completed';
                $contributiontoupp->save();
                $nexttier = $this->getNextClubAndTierByContriObject($contribution_tier);
                if ($nexttier != null) {
                    $updatethisusereligibility = $this->updateEligibilityForBack($contribution->user_id, $nexttier->id, $contribution_tier->id);
                    array_push(
                        $reposnse_thisuser,
                        [
                            'next tier' => $nexttier,
                            'Update eligibility response' => $updatethisusereligibility
                        ]
                    );
                    //migrate the payee incase its not the company and not
                    //get payback totals
                    $counts = ContributionPayback::where('contribution_id_reciving_payback', $contribution->id)->count();
                    ///get payback totals
                    $tierearning['user_id'] = $contribution->user_id;
                    $tierearning['tier_id'] = $contribution->tier_id;
                    $tierearning['total_earnings_so_far'] = $counts * ($contribution->contribution_amount);
                    $tierearning['subscription_used_amount'] = 0;
                    $tierearning['withdraw_amount'] = 0;
                    $tierearning['status'] = 0;
                    $createdearning = TierEarning::create($tierearning);
                    if ($createdearning) {
                        $user = User::findOrFail($contribution->user_id);
                        $user->eligible_tier = 0;
                        $user->eligibility_for_elible = 0;
                        $user->save();
                        // $reposnse = $reposnse . 'BPU has completed this tier and ' . $counts * ($contribution->contribution_amount) . ' are the earnings.';
                    } else {
                        // $reposnse = $reposnse . 'This user has completed this tier and ' . $counts * ($contribution->contribution_amount) . ' failed to be processed.Please contact Admin';
                    }
                } else {
                    $savepayment['user_id'] = $contribution->user_id;
                    $savepayment['description'] = 'Auto payment of exiting Platform';
                    $savepayment['payment_proof'] = 'Auto by Admin';
                    $savepayment['status'] = "APPROVED";
                    $savepayment['amount_paid'] = 50;
                    $masterpayment = MasterPayment::create($savepayment);
                    $companypaymentob['amount_paid'] = 50;
                    $companypaymentob['paid_by'] = $contribution->user_id;
                    $companypaymentob['paid_as'] = 'Exit from club one Tier 2.';
                    $companypaymentob['payment_id'] = $masterpayment->id;
                    $companypayment = CompanyReceivedPayment::create($companypaymentob);

                    $this->registerTheNewUserForAllPhaseTiers(2, $contribution->user_id, 1, 100);
                }

                ///move earnings to earnings table

            }
        } else {
        }

        return $reposnse_thisuser;
    }
    public function assignContributionToAnInvestor($tierobject_to_assign, $user_contributing)
    {
        //get oldest user in this tier liable to a payment
        $oldestnonpaidcontributioninthistier = Contribution::where('tier_id', $tierobject_to_assign->id)->where('payback_count', '<', $tierobject_to_assign->payback_count)->whereNotIn('user_id', [$user_contributing])->orderBy('id', 'ASC')->first();
        $oldestnonpaidcontributioninthistiercount = Contribution::where('tier_id', $tierobject_to_assign->id)->where('payback_count', '<', $tierobject_to_assign->payback_count)->whereNotIn('user_id', [$user_contributing])->where('admin_approved', 'Approved')->orderBy('id', 'ASC')->count();
        ////get oldest user in this tier liable to a payment
        if ($oldestnonpaidcontributioninthistiercount > 0) {
            //assign the contribution to available investor
            //step one - update count and amount
            $payerscontribution = Contribution::where('user_id', $user_contributing)->where('tier_id', $tierobject_to_assign->id)->first();
            $payesscontribution = Contribution::findOrFail($oldestnonpaidcontributioninthistier->id);
            $payesscontribution->payback_paid_total + $payerscontribution->contribution_amount;

            $payesscontribution->payback_count++; // Increment the payback_count by 1
            $payesscontribution->payback_paid_total += $payerscontribution->contribution_amount; // Increment the payback_paid_total by the contribution_amount
            $payesscontribution->save();
            ///step one - update count and amount
            // step two - do entry to paybacks
            $paybabckentry['contribution_id_reciving_payback'] = $payesscontribution->id;
            $paybabckentry['contribution_id_paying_payback'] = $payerscontribution->id;
            $paybabckentry['payment_status'] = 'Verified';
            $paybackentry = ContributionPayback::create($paybabckentry);
            /// step two - do entry to paybacks
            $userpaid = User::where('id', $payesscontribution->user_id)->first();
            if ($payesscontribution && $paybackentry) {
                return json_encode($tierobject_to_assign) . 'Usertoassign' . json_encode($user_contributing) . 'Payment investment has been linked to an investor (' . $userpaid->full_name . ') successfully ' . json_encode($oldestnonpaidcontributioninthistier) . ' count' . $oldestnonpaidcontributioninthistiercount;
            } else {
                return json_encode($tierobject_to_assign) . 'Usertoassign' . json_encode($user_contributing) . 'Payment investment failed to be linked to an investor successfully.PLease alert an Admin' . json_encode($oldestnonpaidcontributioninthistier) . ' count' . $oldestnonpaidcontributioninthistiercount;
            }

            //assign the contribution to available investor
        } else {
            //assign the contribution to company
            $payerscontribution = Contribution::where('user_id', $user_contributing)->where('tier_id', $tierobject_to_assign->id)->first();

            $companypaymentbob['amount_paid'] = $payerscontribution->contribution_amount;
            $companypaymentbob['paid_by'] = $user_contributing;
            $companypaymentbob['paid_as'] = 'Matrix payment for  ' . $tierobject_to_assign->club . ' ' . $tierobject_to_assign->tier_name;
            $companypaymentbob['payment_method'] = 'Unspecified';
            $companypaymentbob['status'] = 'Approved';
            $companypaymentbob['payment_id'] = $payerscontribution->payment_id;
            $companypayment = CompanyReceivedPayment::create($companypaymentbob);
            if ($companypayment) {
                return json_encode($tierobject_to_assign) . 'Usertoassign' . json_encode($user_contributing) . 'Payment investment has been linked to the elevate company successfully' . json_encode($oldestnonpaidcontributioninthistier) . ' count' . $oldestnonpaidcontributioninthistiercount;
            } else {
                return json_encode($tierobject_to_assign) . 'Usertoassign' . json_encode($user_contributing) . 'Payment investment failed to be linked to elevate company successfully.PLease alert an Admin' . json_encode($oldestnonpaidcontributioninthistier) . ' count' . $oldestnonpaidcontributioninthistiercount;
            }
            ///close assign the contribution to company
        }
    }

    public function updateEligibility($user, $nexttier_id, $current_tier_id)
    {
        $message = '';
        $nexttier = MatrixOption::where('id', $nexttier_id)->first();
        $current_tier = MatrixOption::where('id', $current_tier_id)->first();

        if ($this->checkIfUserMeetsEligibility($current_tier_id, $user)) {
            //register subscription
            //save payment
            $savepayment['user_id'] = $user;
            $savepayment['description'] = 'Auto payment of moving to next tier of ' . $nexttier->contribution_amount;
            $savepayment['payment_proof'] = 'Auto by Admin';
            $savepayment['status'] = "PENDING ADMIN APPROVAL";
            $savepayment['amount_paid'] = $nexttier->contribution_amount;
            $masterpayment = MasterPayment::create($savepayment);
            //save payment
            //send to company account
            if ($current_tier->minimum_progression_count == 27) {
                $companypaymentob['amount_paid'] = 5;
                $companypaymentob['paid_by'] = $user;
                $companypaymentob['paid_as'] = 'Exit from platform';
                $companypaymentob['payment_id'] = $masterpayment->id;
                $companypayment = CompanyReceivedPayment::create($companypaymentob);
                // $message="The user has been exited from the platform successfully.";
            } else {

                $matrixcontribution['user_id'] = $user;
                $matrixcontribution['tier_id'] = $nexttier->id;
                $matrixcontribution['payback_paid_total'] = 0;
                $matrixcontribution['payback_count'] = 0;
                // $matrixcontribution['admin_approved']="Approved";
                $matrixcontribution['contribution_amount'] = $nexttier->contribution_amount;
                $matrixcontribution['payment_id'] = $masterpayment->id;
                $matrixcontribution['expected_amount_for_sponsorship'] = $nexttier->recruitment_amount;
                $contribution = Contribution::create($matrixcontribution);
                //auto approve Pay
                $thismatser = MasterPayment::where("id", $masterpayment->id)->with('Bonuses')->with('CompanyPayments')->with('MatrixPayments')->first();

                $this->autoVerifyPayment($thismatser, 1);
                //auto approve Pay
            }
            //send to company account
            //send to matrix
            ///close registering subscription
            //upgrade
            $thiscontributinguser = User::where('id', $user)->first();
            if ($thiscontributinguser->eligible_tier === $current_tier) {
                $thiscontributinguser->eligible_tier = $nexttier;

                return $message;
            } else {
                return 'failed';
            }
            ///close upgrade
        } else {
            return 'Failed to upgrade because the user does not meet the minimum required conditions.';
        }
    }
    public function checkIfUserMeetsEligibility($current_tier_id, $user)
    {
        $current_tier = MatrixOption::where('id', $current_tier_id)->first();
        $contribution = Contribution::where('user_id', $user)->where('tier_id', $current_tier_id)->first();
        $no_of_completed_paybacks = $this->getMyPayBacksCountByConributionObject($contribution);
        $approved_contribution_for_current_tier_user = Contribution::where('user_id', $user)->where('tier_id', $current_tier_id)->where('admin_approved', 'APPROVED')->count();
        if (($no_of_completed_paybacks >= $current_tier->minimum_progression_count) && $approved_contribution_for_current_tier_user == 1) {
            return true;
        } else {
            return false;
        }
    }

    public function updateEligibilityForBack($user, $nexttier_id, $current_tier_id)
    {
        $message = '';
        $nexttier = MatrixOption::where('id', $nexttier_id)->first();
        $current_tier = MatrixOption::where('id', $current_tier_id)->first();
        $response = [];
        array_push($response, [
            'Eligibility check' => $this->checkIfUserMeetsEligibility($current_tier_id, $user)
        ]);
        if ($this->checkIfUserMeetsEligibility($current_tier_id, $user)) {
            //register subscription
            //save payment
            $savepayment['user_id'] = $user;
            $savepayment['description'] = 'Auto payment of moving to next tier of ' . $nexttier->contribution_amount;
            $savepayment['payment_proof'] = 'Auto by Admin';
            $savepayment['status'] = "PENDING ADMIN APPROVAL";
            $savepayment['amount_paid'] = $nexttier->contribution_amount;
            $masterpayment = MasterPayment::create($savepayment);
            //save payment
            //send to company account
            if ($current_tier->minimum_progression_count == 27) {
                $companypaymentob['amount_paid'] = 5;
                $companypaymentob['paid_by'] = $user;
                $companypaymentob['paid_as'] = 'Exit from platform';
                $companypaymentob['payment_id'] = $masterpayment->id;
                $companypayment = CompanyReceivedPayment::create($companypaymentob);
                // $message="The user has been exited from the platform successfully.";
            } else {

                $matrixcontribution['user_id'] = $user;
                $matrixcontribution['tier_id'] = $nexttier->id;
                $matrixcontribution['payback_paid_total'] = 0;
                $matrixcontribution['payback_count'] = 0;
                // $matrixcontribution['admin_approved']="Approved";
                $matrixcontribution['contribution_amount'] = $nexttier->contribution_amount;
                $matrixcontribution['payment_id'] = $masterpayment->id;
                $matrixcontribution['expected_amount_for_sponsorship'] = $nexttier->recruitment_amount;
                array_push($response, [
                    'Passed to upgrade to next tier option 2' => $nexttier->id,
                    'newcontribution' => $matrixcontribution
                ]);
                $contribution = Contribution::create($matrixcontribution);
                //auto approve Pay
                $thismatser = MasterPayment::where("id", $masterpayment->id)->with('Bonuses')->with('CompanyPayments')->with('MatrixPayments')->first();

                $this->autoVerifyPayment($thismatser, 1);
                //auto approve Pay
            }
            //send to company account
            //send to matrix
            ///close registering subscription
            //upgrade
            $thiscontributinguser = User::where('id', $user)->first();
            if ($thiscontributinguser->eligible_tier === $current_tier) {
                $thiscontributinguser->eligible_tier = $nexttier;

                array_push($response, [
                    'Users t eligibility updated' => true,
                    'newcontribution' => $thiscontributinguser
                ]);
            } else {
                array_push($response, [
                    'Users t eligibility updated' => false,
                    'newcontribution' => $thiscontributinguser
                ]);
            }
            ///close upgrade
        } else {
        }
        return $response;
    }
    public function getNextClubAndTierByContriObject($currenttier)
    {

        if ($currenttier->club == 1) {
            if ($currenttier->tier_name == 'Tier 1') {
                $contribution_tier = MatrixOption::where('tier_name', 'Tier 2')->first();
                return $contribution_tier;
            } elseif ($currenttier->tier_name == 'Tier 2') {
                // $contribution_tier = MatrixOption::where('tier_name', 'Tier 3')->first();
                return null;
            }
        }
    }

    public function getPayBacksCountByConributionObject($contribution)
    {
        $contributionpayback = ContributionPayback::join('contributions', 'contributions.id', '=', 'contribution_paybacks.contribution_id_reciving_payback')
            ->join('master_payments', 'master_payments.id', '=', 'contributions.payment_id')
            ->where('master_payments.status', 'APPROVED')
            ->where('contribution_paybacks.contribution_id_paying_payback', $contribution['id'])
            ->select('contribution_paybacks.*', 'contributions.user_id as payee_user_id')->count();

        return $contributionpayback;
    }

    public function getMyPayBacksCountByConributionObject($contribution)
    {
        $contributionpayback = ContributionPayback::join('contributions', 'contributions.id', '=', 'contribution_paybacks.contribution_id_reciving_payback')
            ->join('master_payments', 'master_payments.id', '=', 'contributions.payment_id')
            ->where('master_payments.status', 'APPROVED')
            ->where('contribution_paybacks.contribution_id_reciving_payback', $contribution['id'])
            ->select('contribution_paybacks.*', 'contributions.user_id as payee_user_id')->count();

        return $contributionpayback;
    }

    public function checkUserTierApproval(Request $request)
    {
        return $this->checkIfUserHasPaidForTierandItsApproved($request->tier, $request->user);
    }

    public function checkIfUserHasPaidForTierandItsApproved($tier_id, $user_id)
    {
        $contributionpayback = Contribution::join('master_payments', 'master_payments.id', '=', 'contributions.payment_id');
        $contributionpayback->where('contributions.user_id', $user_id);
        $contributionpayback->where('contributions.tier_id', $tier_id);
        $contributionpayback->where('master_payments.status', 'APPROVED');
        $recordsfound = $contributionpayback->count();
        if ($recordsfound > 0) {
            return 1;
        }

        return 0;
    }

    public function getBackPaidUserBasedOnContributionObject($contributionobject)
    {
        $contributionpaybackq = ContributionPayback::join('contributions', 'contributions.id', '=', 'contribution_paybacks.contribution_id_reciving_payback')

            ->where('contribution_paybacks.contribution_id_paying_payback', $contributionobject['id'])
            ->select('contribution_paybacks.*', 'contributions.user_id as payee_user_id');

        return ['count' => $contributionpaybackq->count(), 'backpaiduser' => $contributionpaybackq->first(), 'contributionobjectid' => $contributionobject['id']];
    }


    public function autoVerifyPayment($payment, $action)
    {
        try {

            DB::beginTransaction();
            $response = '';
            // $payment_arr = json_decode($payment, true);
            $masterPaymentid = $payment->id;
            $contributions = Contribution::where('payment_id', $masterPaymentid)->get();
            $bonuses = BonusPayment::where('payment_id', $masterPaymentid)->get();
            $masterpay = MasterPayment::findOrFail($masterPaymentid);
            if ($masterpay) {
                $masterpay->status = ($action == 1) ? 'APPROVED' : 'REJECTED';
                $masterpay->save();
                if (($action == 1) && $masterpay->save()) {
                    //close update contributions
                    //update bonuses
                    BonusPayment::where('payment_id', $masterPaymentid)->update(['status' => 'Approved']);
                    //update bonuses
                    //update company payments
                    CompanyReceivedPayment::where('payment_id', $masterPaymentid)->update(['status' => 'Approved']);
                    //update company payments
                    //update contributions
                    Contribution::where('payment_id', $masterPaymentid)->update(['admin_approved' => 'Approved']);
                    foreach ($contributions as $contribution) {
                        $contributiontoup = Contribution::findOrFail($contribution['id']);
                        $contributiontoup->admin_approved = 'Approved';
                        if ($contributiontoup) {
                            $response = $this->progressToNextTier($contributiontoup);
                        }
                    }
                } else {
                }
                DB::commit();
            } else {
            }

            return response()->json(['message' => $response, 'data' => $masterPaymentid], 201);
        } catch (Exception $ex) {
            DB::rollBack();

            return response()->json(['message' => 'Verification failed.Please contact Admin.' . $ex->getMessage()], 400);
        }
    }
    public function autoVerifySponsorshipPayment($payment, $action)
    {
        try {

            DB::beginTransaction();
            $response = '';
            // $payment_arr = json_decode($payment, true);
            $masterPaymentid = $payment->id;
            $contributions = Contribution::where('payment_id', $masterPaymentid)->get();
            $bonuses = BonusPayment::where('payment_id', $masterPaymentid)->get();
            $masterpay = MasterPayment::findOrFail($masterPaymentid);
            if ($masterpay) {
                $masterpay->status = ($action == 1) ? 'APPROVED' : 'REJECTED';
                $masterpay->save();
                if (($action == 1) && $masterpay->save()) {
                    //close update contributions
                    //update bonuses
                    BonusPayment::where('payment_id', $masterPaymentid)->update(['status' => 'Approved']);
                    //update bonuses
                    //update company payments
                    CompanyReceivedPayment::where('payment_id', $masterPaymentid)->update(['status' => 'Approved']);
                    //update company payments
                    //update contributions
                    Contribution::where('payment_id', $masterPaymentid)->update(['admin_approved' => 'Approved']);
                    foreach ($contributions as $contribution) {
                        $contributiontoup = Contribution::findOrFail($contribution['id']);
                        $contributiontoup->admin_approved = 'Approved';
                        if ($contributiontoup) {
                            $response = $this->progressToNextTier($contributiontoup);
                        }
                    }
                } else {
                }
                DB::commit();
            } else {
            }

            return response()->json(['message' => $response, 'data' => $masterPaymentid], 201);
        } catch (Exception $ex) {
            DB::rollBack();

            return response()->json(['message' => 'Verification failed.Please contact Admin.' . $ex->getMessage()], 400);
        }
    }
    public function uploadPaymentEvidence(Request $request)
    {
        $file = $request->file('paymentProof');
        $fileName = time() . rand(1, 99) . '.' . $file->extension();
        $file->move(public_path('proofs'), $fileName);

        return $fileName;
    }
    public function investForSponsored($user, $invitedetails, $sponsoringcontribution)
    {

        try {
            DB::beginTransaction();
            //get the tier details
            $matoptions = MatrixOption::where("tier_name", "Tier 1")->first();
            $sponsorshipdetails = null;
            $contribution = null;
            //get the tier details
            //upload payment Proof
            //  $paymentprooffile = $this->uploadPaymentEvidence($request);
            $countcontrionsavailable = Contribution::where('user_id', $user->id)->count();
            $matrixpay = null;
            if ($countcontrionsavailable == 0) {
                //save payment
                $savepayment['user_id'] = $user->id;
                $savepayment['description'] = 'Intial payment of 50.Sponsored registration.';
                $savepayment['payment_proof'] = "";
                $savepayment['amount_paid'] = 50;
                $masterpayment = MasterPayment::create($savepayment);
                $matrixpay = $masterpayment;
                //save payment
                //send to company account
                $companypaymentob['amount_paid'] = 50 - 40;
                $companypaymentob['paid_by'] = $user->id;
                $companypaymentob['paid_as'] = 'Initial Investment';
                $companypaymentob['payment_id'] = $masterpayment->id;
                $companypayment = CompanyReceivedPayment::create($companypaymentob);
                //send to company account
                //send to matrix
                $tier1 = MatrixOption::where('club', 1)->where('tier_name', 'Tier 1')->first();
                $matrixcontribution['user_id'] = $user->id;
                $matrixcontribution['tier_id'] = $tier1->id;
                $matrixcontribution['payback_paid_total'] = 0;
                $matrixcontribution['contribution_amount'] = 50 - 20;
                $matrixcontribution['payment_id'] = $masterpayment->id;
                $matrixcontribution['expected_amount_for_sponsorship'] = $tier1->recruitment_amount;
                $contribution = Contribution::create($matrixcontribution);
                //send to matrix
                //send to bonus
                if ($user->isAdminInvite == 1) {
                    $companypaymentbob['amount_paid'] = 50 - 40;
                    $companypaymentbob['paid_by'] = $user->id;
                    $companypaymentbob['paid_as'] = 'Joining Bonus';
                    $companypaymentbob['payment_method'] = 'Unspecified';
                    $companypaymentbob['payment_id'] = $masterpayment->id;
                    $companypayment = CompanyReceivedPayment::create($companypaymentbob);
                } else {

                    $bonusp['amount_paid'] = 50 - 40;
                    $bonusp['paid_by'] = $user->id;
                    $bonusp['bonus_for'] = 'Joining Bonus';
                    $bonusp['payment_id'] = $masterpayment->id;
                    $bonusp['is_sponsorship'] = 1;
                    $bonusp = BonusPayment::create($bonusp);
                }
                //send to bonus
                //update investm*ent status
                $sponsorshipdetails = $this->processSponsoredRegistration($invitedetails, $matrixpay, $sponsoringcontribution);
                //update investiment status

            } else {
                return response()->json([
                    'message' => 'You have already paid your membership fee.',
                    'allmesag' => $sponsorshipdetails
                ], 201);
            }
            // upload Payment Proof
            DB::commit();
            return response()->json([
                'message' => 'Your registration is successful.',
                'sponsorship_details' => $sponsorshipdetails,
                'user_id' => $user->id,
                'contribution' => $contribution
            ], 201);
        } catch (\Exception $exp) {
            DB::rollBack();
            return response()->json([
                'message' => 'Request has not been successfully processed.' . $exp->getMessage(),
                'user_id' => $user

            ], 400);
        }
    }
    public function processSponsoredRegistration($invitedetails, $payment, $sponsoringcontribution)
    {
        $whoinvited = $invitedetails->user_id;
        $response = null;
        $eligible =  Contribution::find($sponsoringcontribution->id);

        if ($eligible != null) {
            // update
            $eligible->increment("sponsorship_total_used", 50);
            if ($eligible->save()) {

                $response['sponsoring_contribution'] = $sponsoringcontribution;
                $response['eligible'] = $eligible;
                $response['auto_approval_details'] = $this->autoVerifySponsorshipPayment($payment, 1);
            } else {
                $response['auto_approval_details'] = [];
            }
            //update  

        } else {
            return $eligible;
        }
        return $response;
    }

    //phase migrations
    public function exitUserToPhase($user_id, $amount, $tier_id)
    {
    }
    public function registerTheNewUserForAllPhaseTiers($club, $user_id, $prev_club, $amoun_paid)
    {
        $messagepayback = "";
        try {
            DB::beginTransaction();

            $exitingtier = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("matrix_options.club", $prev_club)
                ->select("matrix_options.*", "clubs.club_name")
                ->orderBy("id", "DESC")
                ->first();

            $clubstiers = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("matrix_options.club", $club)
                ->select("matrix_options.*", "clubs.club_name")
                ->get();
            $totalforclub = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("matrix_options.club", $club)
                ->select(DB::raw('SUM(matrix_options.contribution_amount) as total_to_pay'), DB::raw('SUM(matrix_options.payback_amount) as total_to_receive'))
                ->groupBy("matrix_options.club")
                ->first();

            $description = 'Migration from ' . $exitingtier->club_name . " " . $exitingtier->tier_name;
            $savePayment = [
                'user_id' => $user_id,
                'description' =>  $description,
                'payment_proof' => "Auto Payment",
                'amount_paid' => $amoun_paid,
                'status' => 'APPROVED'
            ];
            $masterPayment = MasterPayment::create($savePayment);
            $transitioned = [];
            $userstopay = [];
            $user_to_pay = [];
            $totalforclub;


            // return $clubstiers;
            if ($masterPayment != null) {
                foreach ($clubstiers as $club) {
                    $tier_id = $club->id;
                    // Get the tier details
                    $matoptions = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                        ->where("matrix_options.id", $tier_id)
                        ->select("matrix_options.*", "matrix_options.id as matrix_tier", "clubs.club_name")
                        ->first();
                    // Check if user has any existing contributions
                    $countContributions = Contribution::where('user_id', $user_id)->where('tier_id', $tier_id)->count();
                    if ($countContributions == 0) {
                        // Save payment

                        //close Save payment
                        //

                        // Save contribution to matrix
                        $matrixContribution = [
                            'user_id' => $user_id,
                            'tier_id' => $matoptions->matrix_tier,
                            'payback_paid_total' => 0,
                            'contribution_amount' => $matoptions->contribution_amount,
                            'payment_id' => $masterPayment->id,
                            'expected_amount_for_sponsorship' => $matoptions->recruitment_amount,
                            'admin_approved' =>"Approved"
                        ];
                        $contribution_ = Contribution::create($matrixContribution);
                        // ($tier, $notuser,$paybackcount,$paybackamount)
                        $user_to_pay = $this->checkTheUserInThisTierToReceivePayInATier($tier_id, $user_id, $matoptions->payback_count, $matoptions->payback_amount);
                        array_push($userstopay, ['tier' => $tier_id, 'user_id' => $user_id, 'user_to_pay' => $user_to_pay, 'thiscontibution' => $matrixContribution]);

                        if ($contribution_ != null &&  $user_to_pay != null) {

                            $topayuser =   Contribution::join("matrix_options", "matrix_options.id", "=", "contributions.tier_id")
                                ->where("contributions.payback_count", "<", $matoptions->payback_count)
                                ->where("contributions.tier_id", $contribution_->tier_id)
                                ->orderBy("contributions.id", "ASC")
                                ->select("contributions.*")
                                ->first();

                            if ($topayuser && $user_to_pay) {

                                $paybackEntry = [
                                    'contribution_id_reciving_payback' => $user_to_pay->receiving_contribution_id,
                                    'contribution_id_paying_payback' => $contribution_->id,
                                    'payment_status' => 'Verified'
                                ];
                                // array_push($userstopay,$paybackEntry);

                                if (ContributionPayback::create($paybackEntry)) {
                                    //increament pay count on reciving side
                                    $payesscontribution = Contribution::findOrFail($user_to_pay->receiving_contribution_id);
                                    $payesscontribution->payback_count += 1;
                                    $payesscontribution->payback_paid_total += $matoptions->contribution_amount;
                                    if ($payesscontribution->payback_paid_total >= $matoptions->payback_amount) {
                                        $payesscontribution->status = "Completed";
                                    }
                                    $payesscontribution->save();

                                    // $payesscontribution = Contribution::findOrFail($user_to_pay->receiving_contribution_id);

                                    // $afterupdateamount=$payesscontribution->payback_paid_total+$matoptions->contribution_amount;
                                    // $afterupdatecount=$payesscontribution->payback_count+1;
                                    //   if($afterupdateamount >= $matoptions->payback_amount){
                                    //     $payesscontribution->status="Completed";
                                    //   }
                                    // $payesscontribution->payback_count++; // Increment the payback_count by 1                                    
                                    // $payesscontribution->payback_paid_total += $matoptions->contribution_amount; // Increment the payback_paid_total by the contribution_amount

                                    // $payesscontribution->save();

                                    // return $transitioned;
                                    //increment pay count on receiving side     
                                    //update status
                                    //  $toupstatus=Contribution::where("id",$user_to_pay->receiving_contribution_id)->first();
                                    // if($payesscontribution->payback_paid_total == $matoptions->payback_amount ){
                                    //     $payesscontribution->status="Completed";
                                    //     $payesscontribution->save();
                                    // }
                                    //update status                           
                                }
                            }
                        } else if ($contribution_ && $user_to_pay == null) {
                            $this->payCompany($masterPayment->id, $description, $user_id, $matoptions->contribution_amount);
                        }
                        //close Save contribution to matrix    
                        //transitioned user
                        //transition user
                    }
                }
                if ($user_to_pay) {
                    $transitionedmsg = $this->transitionUserToNexClubtTiers($club, $user_to_pay, $totalforclub->total_to_receive, $totalforclub->total_to_pay, $matoptions->matrix_tier);
                    array_push($transitioned, $transitionedmsg);
                }
            }



            DB::commit();
            return response()->json([
                'message' => 'User registration and payment successful.' . $messagepayback,
                'transitioningmsg' => $transitioned
                // 'userstopay'=>$userstopay
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error(': ' . $e->getMessage(), [
                'stack' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Request has not been successfully processed. ' . $e->getMessage(),
                'stack' => $e->getTraceAsString()
            ], 400);
        }
    }

    public function payTierExistingUsers($contribution)
    {
        try {
            DB::beginTransaction();

            // Find the first contribution to pay back
            $topayuser = Contribution::join("matrix_options", "matrix_options.id", "=", "contributions.tier_id")
                ->where("contributions.payback_count", "<", $contribution->payback_count)
                ->where("contributions.tier_id", $contribution->tier_id)
                ->orderBy("contributions.id", "ASC")
                ->select("contributions.*")
                ->first();
            return $topayuser;
            if ($topayuser) {
                $paybackEntry = [
                    'contribution_id_receiving_payback' => $topayuser->id,
                    'contribution_id_paying_payback' => $contribution->id,
                    'payment_status' => 'Verified'
                ];

                ContributionPayback::create($paybackEntry);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return $e->getMessage();
        }
    }
    public function payCompany($masterp, $description, $paid_by, $amount)
    {
        $companypaymentbob['amount_paid'] = $amount;
        $companypaymentbob['paid_by'] = $paid_by;
        $companypaymentbob['paid_as'] = $description;
        $companypaymentbob['payment_method'] = 'Unspecified';
        $companypaymentbob['status'] = 'Approved';
        $companypaymentbob['payment_id'] = $masterp;
        $companypayment = CompanyReceivedPayment::create($companypaymentbob);
    }
    public function  checkTheUserInThisTierToReceivePayInATier($tier, $notuser, $paybackcount, $paybackamount)
    {

        $contrusertopay = Contribution::join("matrix_options", "matrix_options.id", "=", "contributions.tier_id")
            ->where("tier_id", $tier)
            ->where("contributions.user_id", "<>", $notuser)
            ->where("contributions.payback_paid_total", "<", $paybackamount)
            ->where("contributions.payback_count", "<", $paybackcount)
            ->orderBy("contributions.id", "ASC")
            ->select("contributions.id as receiving_contribution_id", "contributions.user_id as user_id")
            ->first();
        return $contrusertopay;
    }
    public function checkIfUserHasReceivedAndPaid($club, $usertotransist, $clubtargettoreceive, $clubtargettosend)
    {
        $totalpaid = Contribution::join("matrix_options", "matrix_options.id", "=", "contributions.tier_id")
            ->where("matrix_options.club", $club->club)  // Make sure to specify the table for the 'club' field
            ->where("contributions.user_id", $usertotransist)  // Make sure to specify the table for the 'user_id' field
            // ->where("admin_approved", "Approved")  // Uncomment if needed
            ->select(DB::raw('sum(contributions.contribution_amount) as total_paid'))
            ->groupBy("matrix_options.club")
            ->first();

        $totalpaid = $totalpaid ? $totalpaid->total_paid : 0;

        $total_received = Contribution::join("matrix_options", "matrix_options.id", "=", "contributions.tier_id")
            ->where("matrix_options.club", $club->club)  // Ensure proper table prefix
            ->where("contributions.user_id", $usertotransist)  // Ensure proper table prefix
            // ->where("admin_approved", "Approved")  // Uncomment if needed
            ->select(DB::raw('sum(contributions.payback_paid_total) as total_received'))  // Corrected the select clause
            ->groupBy("matrix_options.club")
            ->first();

        $total_received = $total_received ? $total_received->total_received : 0;

        if ($clubtargettoreceive == $total_received && $clubtargettosend == $totalpaid) {
            return ['status' => true, 'club' => $club, 'clubtargettoreceive' => $clubtargettoreceive, 'totalPaybacks' => $total_received, 'clubtargettosend' => $clubtargettosend, 'totalpaid' => $totalpaid];
        } else {
            return ['status' => false, 'club' => $club, 'clubtargettoreceive' => $clubtargettoreceive, 'totalPaybacks' => $total_received, 'clubtargettosend' => $clubtargettosend, 'totalpaid' => $totalpaid];
        }
    }
    public function transitionUserToNexClubtTiers($club, $usertotransist, $clubtargettoreceive, $clubtargettosend, $currenttier)
    {
        //       
        $check = $this->checkIfUserHasReceivedAndPaid($club, $usertotransist->user_id, $clubtargettoreceive, $clubtargettosend);
        if ($check['status']) {
            $getnextclub = $this->getNextClubBasedOnCurrentTier($currenttier);
            $clubnext = $getnextclub;
            $user_id = $usertotransist->user_id;
            $prev_club = $club;
            $amoun_paid = $getnextclub['total_to_pay'];
            $migrationresults = $this->registerTheNewUserForAllPhaseTiers($clubnext['club_details']['club_id'], $usertotransist->user_id, $prev_club->club, $amoun_paid);
            return [
                'code' => 1,
                'migration_data' => ['club' => $clubnext['club_details']['club_id'], 'user_id' => $usertotransist->user_id, 'prev' => $prev_club->club, 'amount' => $amoun_paid],
                'checkers' => ['club' => $club, 'usertotransit' => $usertotransist, 'clubtargettoreceive' => $clubtargettoreceive, 'clubtargettosend' => $clubtargettosend, 'clubtargettosend' => $clubtargettosend, 'currenttier' => $currenttier],
                'existingresults' => $check,
                'nextclub' => $getnextclub,
                'prev_club' => $prev_club,
                'migrationresults' => $migrationresults,
                'message' => 'Successfully transitioned'
            ];
        } else {
            return [
                'code' => 0,
                'checkers' => ['club' => $club, 'usertotransit' => $usertotransist, 'clubtargettoreceive' => $clubtargettoreceive, 'clubtargettosend' => $clubtargettosend, 'clubtargettosend' => $clubtargettosend, 'currenttier' => $currenttier],
                'existingresults' => $check,
                'message' => 'Has not fully paid'
            ];
        }
    }
    public function getNextClubBasedOnCurrentTier($currenttier)
    {
        // try {
        //     DB::beginTransaction();
        $currenttierclub = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
            ->where("matrix_options.id", $currenttier)
            ->select("matrix_options.id as matrix_id", "clubs.club_name as club_name", "matrix_options.club as club_id")->first();
        $nextclub['current'] = $currenttierclub;
        if ($currenttierclub->club_name == "club 2") {
            $nextclub['club_details'] = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("clubs.club_name", "club 3")
                ->select("matrix_options.*", "matrix_options.club as club_id")
                ->first();
            $nextclub['total_to_pay'] = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("clubs.club_name", "club 3")
                ->select(DB::raw('SUM(matrix_options.contribution_amount) as total_to_pay'))
                ->groupBy("matrix_options.club")
                ->first()
                ->total_to_pay;
        } else if ($currenttierclub->club_name == "club 3") {
            $nextclub['club_details'] = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("clubs.club_name", "club 4")
                ->select("matrix_options.*", "matrix_options.club as club_id")
                ->first();
            $nextclub['total_to_pay'] = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("clubs.club_name", "club 4")
                ->select(DB::raw('SUM(matrix_options.contribution_amount) as total_to_pay'))
                ->groupBy("matrix_options.club")
                ->first()
                ->total_to_pay;
        } else if ($currenttierclub->club_name == "club 4") {
            $nextclub['club_details'] = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("clubs.club_name", "club 1")
                ->select("matrix_options.*", "matrix_options.club as club_id")
                ->first();
            $nextclub['total_to_pay'] = MatrixOption::join("clubs", "clubs.id", "=", "matrix_options.club")
                ->where("clubs.club_name", "club 1")
                ->select(DB::raw('SUM(matrix_options.contribution_amount) as total_to_pay'))
                ->groupBy("matrix_options.club")
                ->first()
                ->total_to_pay;
        }

        return $nextclub;
    }
    public function syncSponsorshipsEntriesOnContributions(Request $request)
    {
    }
}
