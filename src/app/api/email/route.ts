import { EmailTemplate } from "@/components/VerifyEmail";
import { Resend } from "resend";
const resend = new Resend("re_U6zcBGa7_8kLC7P5Hxf7LYkBsTsNsgxdB");

export async function GET() {
  await resend.emails.send({
    from: "Atlas <delivered@resend.dev>",
    to: ["ammarelbehery04@gmail.com"],
    subject: "Verify your email - Atlas",
    text: "Verify your email to start shopping at Atlas",
    react: EmailTemplate({
      verificationToken: "000000",
      name: "Ammar Elbehery",
    }),
  });

  return new Response("OK");
}
