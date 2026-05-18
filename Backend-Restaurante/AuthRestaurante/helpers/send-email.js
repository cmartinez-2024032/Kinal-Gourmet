import nodemailer from 'nodemailer'

export const sendVerificationEmail = async (email, token) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

const verificationLink = `http://localhost:5173/verify/${token}`

  await transporter.sendMail({
    from: `"Auth Restaurante" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifica tu cuenta!',
    html: `
      <h2>Verifica tu cuenta</h2>
      <p>Haz click en el siguiente enlace para activar tu cuenta:</p>
      <br><br>
      <a href="${verificationLink}">${verificationLink}</a>
    `
  })
}

export const sendResetPasswordEmail = async (email, name, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // ✅ Ruta corregida
  const resetLink = `http://localhost:5173/reset-password/${token}`

  await transporter.sendMail({
    from: `"Kinal Gourmet House" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Restablece tu contraseña - Kinal Gourmet House',
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: auto;">
        <h2 style="color: #e8602c;">Kinal Gourmet House</h2>

        <p>Hola <strong>${name}</strong>,</p>

        <p>
          Recibimos una solicitud para restablecer tu contraseña.
        </p>

        <a href="${resetLink}"
           style="
             display:inline-block;
             margin:20px 0;
             padding:14px 28px;
             background:#e8602c;
             color:#fff;
             text-decoration:none;
             border-radius:8px;
             font-weight:700;
           ">
          Restablecer contraseña
        </a>

        <p style="color:#999;font-size:0.85rem;">
          Este enlace expira en <strong>1 hora</strong>.
          Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    `
  })
}
