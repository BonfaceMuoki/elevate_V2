<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendPasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;
    protected $token,$user,$resetlink;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($token,$user,$resetlink)
    {
        //
        $this->token=$token;
        $this->user=$user;
        $this->resetlink=$resetlink;
    }

    /**
     * Get the message envelope.
     *
     * @return \Illuminate\Mail\Mailables\Envelope
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Password Reset',
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
            view: 'Email.resetPassword',
            with: [
                'token' => $this->token,
                'resetlink' => $this->resetlink,
                'usernames' => $this->user['full_name'],
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
