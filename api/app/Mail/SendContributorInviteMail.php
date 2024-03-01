<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendContributorInviteMail extends Mailable
{
    use Queueable, SerializesModels;


    public $token, $registration_url, $invite,$invitinguser;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($token, $registration_url,$invitinguser, $invite)
    {
        $this->token = $token;
        $this->registration_url = $registration_url;
        $this->invitinguser=$invitinguser;
        $this->invite=$invite;
        //
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Investor Invite',
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
            view: 'Email.contributor.invite',
            with: [
                'token' => $this->token,
                'rgistrationcallbackurl' => $this->registration_url,
                'inviting_user' => $this->invitinguser,
                'invite' => $this->invite,
            ],
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