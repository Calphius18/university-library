import { serve } from "@upstash/workflow/nextjs";

type InitialData = {
  email: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email } = context.requestPayload;
  console.log("🔥 Workflow started:", context.requestPayload);

  // 👋 Welcome email right after signup
  await context.run("new-signup", async () => {
    await sendEmail("welcome", email);
  });

  // wait 3 days, then follow up
  await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

  while (true) {
    const state = await context.run("check-user-state", async () => {
      return await getUserState();
    });

    if (state === "non-active") {
      await context.run("send-email-non-active", async () => {
        await sendEmail("non-active", email);
      });
    } else if (state === "active") {
      await context.run("send-email-active", async () => {
        await sendEmail("active", email);
      });
    }

    await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
  }
});

// 🔑 EmailJS integration
async function sendEmail(type: "welcome" | "non-active" | "active", email: string) {
  let subject: string;
  let message: string;

  if (type === "welcome") {
    subject = "Welcome to the CaliBooks family!";
    message = `Welcome to the CaliBooks family! 🎉\n\nYour account has been successfully created, and you're now ready to explore all the great features we offer.\n\nIf you have any questions or need help getting started, our support team is just an email away at support@calibooks.com.\n\nBest regards,\nThe CaliBooks Team`;
  } else if (type === "non-active") {
    subject = "We miss you at CaliBooks!";
    message = `It looks like you haven’t been active recently. Come back and explore the latest resources waiting for you! 📚`;
  } else {
    subject = "Here’s what’s new at CaliBooks!";
    message = `Thank you for staying active 🙌\nHere’s the latest newsletter and new features just for you.`;
  }

  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: email,
          subject,
          message,
          company_name: "CaliBooks",
          company_email: "support@calibooks.com",
        },
      }),
    });
    console.log(`✅ Sent ${type} email to ${email}`);
  } catch (err) {
    console.error(`❌ Failed to send ${type} email:`, err);
  }
}

type UserState = "non-active" | "active";

const getUserState = async (): Promise<UserState> => {
  // Stubbed logic — replace with real checks later
  return "non-active";
};
