import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "W-Agency <noreply@w-agency.dev>";

export async function sendConfirmedEmail(opts: {
  to: string;
  clientName: string;
  projectDescription: string;
  estimatedPrice: number | null;
}) {
  const { to, clientName, projectDescription, estimatedPrice } = opts;
  const priceText = estimatedPrice ? `$${estimatedPrice.toLocaleString()}` : "TBD";

  return resend.emails.send({
    from: FROM,
    to,
    subject: "🎉 Your Project Has Been Accepted — W-Agency",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#06060A;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#06060A;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="100%" style="max-width:560px;background:#0D0D14;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#5E4BF0,#FF3D6B);padding:40px 40px 36px;">
              <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;font-family:Arial;">W</div>
              <h1 style="margin:20px 0 0;color:#fff;font-size:26px;font-weight:800;line-height:1.2;">
                Project Accepted! 🎉
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#8B89A8;font-size:15px;margin:0 0 20px;">Hi <strong style="color:#ECEAFF;">${clientName}</strong>,</p>
              <p style="color:#8B89A8;font-size:15px;line-height:1.7;margin:0 0 28px;">
                Great news! Bilal has reviewed your project inquiry and is excited to move forward.
                Your project has been <strong style="color:#4ADE80;">officially accepted</strong>.
              </p>

              <!-- Project box -->
              <div style="background:#13131E;border:1px solid rgba(94,75,240,0.2);border-radius:12px;padding:24px;margin-bottom:28px;">
                <p style="color:#4A4866;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">Project Overview</p>
                <p style="color:#ECEAFF;font-size:14px;line-height:1.6;margin:0 0 16px;">${projectDescription}</p>
                <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">
                  <span style="color:#8B89A8;font-size:13px;">Estimated Price</span>
                  <span style="color:#5E4BF0;font-size:20px;font-weight:800;">${priceText}</span>
                </div>
              </div>

              <p style="color:#8B89A8;font-size:15px;line-height:1.7;margin:0 0 28px;">
                You can now log in to your account to chat directly with Bilal, share references,
                and track your project progress in real time.
              </p>

              <!-- CTA -->
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/messages"
                style="display:inline-block;background:linear-gradient(135deg,#5E4BF0,#7C6BF5);color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;">
                Open Project Chat →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="color:#4A4866;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} W-Agency · Built with care by Bilal
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

export async function sendRejectedEmail(opts: {
  to: string;
  clientName: string;
  projectDescription: string;
}) {
  const { to, clientName, projectDescription } = opts;

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Project Update from W-Agency",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#06060A;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#06060A;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 20px;">
        <table width="100%" style="max-width:560px;background:#0D0D14;border-radius:16px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
          <tr>
            <td style="background:#13131E;padding:40px 40px 36px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="width:44px;height:44px;background:#5E4BF0;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;font-family:Arial;">W</div>
              <h1 style="margin:20px 0 0;color:#ECEAFF;font-size:24px;font-weight:800;line-height:1.2;">
                Project Update
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#8B89A8;font-size:15px;margin:0 0 20px;">Hi <strong style="color:#ECEAFF;">${clientName}</strong>,</p>
              <p style="color:#8B89A8;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Thank you so much for reaching out to W-Agency. After careful consideration,
                we're unable to take on your current project at this time.
              </p>
              <p style="color:#8B89A8;font-size:15px;line-height:1.7;margin:0 0 28px;">
                This is not a reflection of your idea — we simply have capacity constraints
                or the scope doesn't align with our current focus. We genuinely appreciate
                your interest and encourage you to reach out again in the future.
              </p>
              <p style="color:#8B89A8;font-size:15px;line-height:1.7;margin:0;">
                Wishing you all the best with your project. 🙏
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="color:#4A4866;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} W-Agency · Built with care by Bilal
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}
