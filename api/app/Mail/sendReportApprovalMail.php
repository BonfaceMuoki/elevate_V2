<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class sendReportApprovalMail extends Mailable
{
    use Queueable, SerializesModels;
    public $nameofRecipient, $emailofRecipient, $phoneofRecipient, $accessCode, $reportDetails, $valuerdetails;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct()
    {

        //
    }
    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */public function envelope()
    {
        return new Envelope(
            subject: 'Membership Fee Approval',
        );
    }

    /**
     * Get the message content definition.
     *
     * @return \Illuminate\Mail\Mailables\Content
     */
    public function content()
    {
        return new Content(
            view: 'Email.contributor.paymentApproval',
            with: []
        );
    }
    /**
     * Get the attachments for the message.
     *
     * @return array
     */
    public function attachments()
    {
        return [];
    }
}
