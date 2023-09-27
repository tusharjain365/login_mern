const nodemailer=require("nodemailer");
const env=require("../config");
const Mailgen = require('mailgen');


const nodeConfig={
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: env.EMAIL,
        pass: env.PASSWORD
    }
}

const transporter=nodemailer.createTransport(nodeConfig);

const MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Mailgen',
        link: 'https://mailgen.js/'
    }
});


const registerMail=async(req,res)=>{
    const {username,userEmail,subject, text}=req.body;

    const email={
        body:{
            name:username,
            intro:text||"Welcome to this login app.",
            outro:"If you did not made the request, just ignore it."
        }
    }

    const emailBody=MailGenerator.generate(email);

    const message={
        from:env.EMAIL,
        to:userEmail,
        subject:subject||"Registration successfull",
        html: emailBody
    }

    transporter.sendMail(message).then(()=>{
        return res.status(200).send({msg:"Mail sent successfully"});
    }).catch(error=>{
        return res.status(500).send({error:"Mail not sent successfully"});
    })
}

module.exports=registerMail;