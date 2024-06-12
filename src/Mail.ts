
import nodemailer from 'nodemailer';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

import Log from './Log';
import LoadFile from './LoadFile';

class Mail
{
    private _mailAuth: any;
    private _transporter: any = undefined;
    private _isInited: boolean = false;
    private _mailProvider: string = "";

    constructor()
    {

    }

    public async Init(mail_config_file: string, mailProvider: string)
    {
        this._mailProvider = mailProvider;
        if(mailProvider === "sg")
        {
            sgMail.setApiKey((await LoadFile(mail_config_file)).toString());
        }
        else
        {
            this._mailAuth = JSON.parse((await LoadFile(mail_config_file)).toString()) as any;

            if(this._mailAuth)
            {
                this._transporter = nodemailer.createTransport(this._mailAuth);
            }
            else
            {
                throw new Error("Invalid mail configuration.");
            }
        }
        this._isInited = true;
    }

    public IsInited()
    {
        return this._isInited;
    }

    public Send(from: string, to: string, subject: string, text: string, html?: string, bcc?: string, replyTo?: string) : Promise<void>
    {
        return new Promise((resolve, reject) =>
        {
            if(this.IsInited())
            {
                let mail_options: { [id: string]: any } =
                {
                    from: from,
                    to: to,
                    subject: subject,
                    text: text
                };

                if(html)
                {
                    mail_options = { html: html, ...mail_options};
                }

                if(bcc)
                {
                    mail_options = { bcc: bcc, ...mail_options};
                }

                if(replyTo)
                {
                    mail_options = { replyTo: replyTo, ...mail_options};
                }

                Log.Info(`Sending mail to ${to}`);

                if(this._mailProvider === "sg")
                {
                    sgMail
                    .send(mail_options as MailDataRequired)
                    .then(() => {}, (error: any) =>
                    {
                        Log.Info(`Email sent with sg:`)
                        Log.Info(error);
                    });
                }
                else
                {
                    this._transporter.sendMail(mail_options, function(error: any, info: any)
                    {
                        if (error)
                        {
                            Log.Error(`Error sending email: ${error}`);
                            reject();
                        }
                        else
                        {
                            Log.Info(`Email sent successfully: ${info.response}`)
                            resolve();
                        }
                    });
                }
            }
            else
            {
                Log.Error("Mail config is not loaded.");
                reject();
            }
        });
        
    }
}

export default Mail;
