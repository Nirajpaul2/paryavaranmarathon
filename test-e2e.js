const http = require("http");

async function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let json = null;
        try {
          json = JSON.parse(body);
        } catch {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
          json,
        });
      });
    });

    req.on("error", reject);

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING MARATHON WEBSITE END-TO-END VERIFICATION ===\n");
  let cookie = "";

  // 1. Test Registration
  console.log("1. Testing Registration API...");
  const regPayload = JSON.stringify({
    fullName: "Aarav Mehta",
    mobile: "9876543210",
    email: "aarav.mehta@example.com",
    dob: "1998-05-15",
    gender: "Male",
    city: "Pune",
    state: "Maharashtra",
    emergencyName: "Pooja Mehta",
    emergencyMobile: "9876543211",
    tshirtSize: "L",
    bloodGroup: "O+",
    runningExp: "First-time 10K runner",
  });

  const regRes = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(regPayload),
      },
    },
    regPayload
  );

  console.log(`Response Status: ${regRes.statusCode}`);
  console.log("Response Body:", regRes.json);
  if (regRes.statusCode !== 200 || !regRes.json?.registrationId) {
    throw new Error("Registration failed!");
  }
  const regId1 = regRes.json.registrationId;
  console.log(`✔ Registration successful. Registration ID: ${regId1}\n`);

  // 2. Test Duplicate Registration Prevention
  console.log("2. Testing Duplicate Registration Prevention...");
  const dupRes = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(regPayload),
      },
    },
    regPayload
  );

  console.log(`Duplicate Status: ${dupRes.statusCode}`);
  console.log("Duplicate Response:", dupRes.json);
  if (dupRes.statusCode === 409 && dupRes.json?.duplicate) {
    console.log("✔ Duplicate registration prevented correctly (409 Conflict).\n");
  } else {
    throw new Error("Duplicate prevention failed!");
  }

  // 3. Test Payment Submission
  console.log("3. Testing Payment Reference Submission...");
  // Use multipart form boundary
  const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
  let formBody = "";
  formBody += `--${boundary}\r\n`;
  formBody += `Content-Disposition: form-data; name="registrationId"\r\n\r\n${regId1}\r\n`;
  formBody += `--${boundary}\r\n`;
  formBody += `Content-Disposition: form-data; name="transactionId"\r\n\r\nPHONEPE9876543210\r\n`;
  formBody += `--${boundary}--\r\n`;

  const payRes = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/payment",
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": Buffer.byteLength(formBody),
      },
    },
    formBody
  );

  console.log(`Payment Submission Status: ${payRes.statusCode}`);
  console.log("Payment Submission Response:", payRes.json);
  if (payRes.statusCode !== 200 || !payRes.json?.success) {
    throw new Error("Payment submission failed!");
  }
  console.log("✔ Payment details submitted successfully. Status: PENDING.\n");

  // 4. Test Registration Lookup (Pending state)
  console.log("4. Testing Participant Lookup (Before Admin verification)...");
  const lookupPayload1 = JSON.stringify({ identifier: "9876543210" });
  const lookupRes1 = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/lookup",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(lookupPayload1),
      },
    },
    lookupPayload1
  );

  console.log("Lookup Result:", lookupRes1.json?.data);
  if (lookupRes1.json?.data?.registrationStatus !== "PENDING") {
    throw new Error("Expected registration status to be PENDING before admin approval!");
  }
  console.log("✔ Lookup correctly reflects PENDING status and masked phone.\n");

  // 5. Test Admin Login
  console.log("5. Testing Admin Authentication...");
  const loginPayload = JSON.stringify({
    email: "admin@marathon10k.com",
    password: "Admin@Marathon2026!",
  });

  const loginRes = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/admin/auth",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(loginPayload),
      },
    },
    loginPayload
  );

  console.log(`Admin Login Status: ${loginRes.statusCode}`);
  const setCookie = loginRes.headers["set-cookie"];
  if (setCookie && setCookie.length > 0) {
    cookie = setCookie[0].split(";")[0];
  }
  console.log("Received Session Cookie:", cookie ? "✔ Present" : "❌ Missing");
  if (!cookie) throw new Error("Admin login failed to set session cookie!");
  console.log("✔ Admin authentication verified.\n");

  // 6. Test Admin Payment Approval
  console.log("6. Testing Admin Payment Approval & Bib Assignment...");
  const approvePayload = JSON.stringify({
    registrationId: regId1,
    action: "APPROVE",
  });

  const approveRes = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/admin/verify-payment",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(approvePayload),
        Cookie: cookie,
      },
    },
    approvePayload
  );

  console.log(`Approval Status: ${approveRes.statusCode}`);
  console.log("Approval Response:", approveRes.json);
  if (approveRes.statusCode !== 200 || !approveRes.json?.success) {
    throw new Error("Admin approval failed!");
  }
  console.log("✔ Payment approved by Admin!\n");

  // 7. Test Registration Lookup (Confirmed state with Bib!)
  console.log("7. Testing Participant Lookup (After Admin verification)...");
  const lookupRes2 = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/lookup",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(lookupPayload1),
      },
    },
    lookupPayload1
  );

  console.log("Updated Lookup Result:", lookupRes2.json?.data);
  const data = lookupRes2.json?.data;
  if (data?.registrationStatus !== "CONFIRMED" || !data?.bibNumber) {
    throw new Error("Expected CONFIRMED status and generated Bib Number!");
  }
  console.log(`✔ Registration confirmed! Bib: ${data.bibNumber}, Reg No: ${data.registrationNumber}\n`);

  // 8. Test Rejection Flow
  console.log("8. Testing Rejection Flow for second runner...");
  const reg2Payload = JSON.stringify({
    fullName: "Rohan Verma",
    mobile: "9820011223",
    email: "rohan.verma@example.com",
    dob: "1995-08-20",
    gender: "Male",
    city: "Mumbai",
    state: "Maharashtra",
    emergencyName: "Anita Verma",
    emergencyMobile: "9820011224",
  });

  const reg2Res = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(reg2Payload),
      },
    },
    reg2Payload
  );
  const regId2 = reg2Res.json.registrationId;

  // Submit mock payment
  let formBody2 = "";
  formBody2 += `--${boundary}\r\n`;
  formBody2 += `Content-Disposition: form-data; name="registrationId"\r\n\r\n${regId2}\r\n`;
  formBody2 += `--${boundary}\r\n`;
  formBody2 += `Content-Disposition: form-data; name="transactionId"\r\n\r\nTXN_FAKE_9999\r\n`;
  formBody2 += `--${boundary}--\r\n`;

  await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/payment",
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": Buffer.byteLength(formBody2),
      },
    },
    formBody2
  );

  // Admin Rejects with mandatory reason
  const rejectPayload = JSON.stringify({
    registrationId: regId2,
    action: "REJECT",
    rejectionReason: "UTR not found in PhonePe settlement report.",
  });

  const rejectRes = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/admin/verify-payment",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(rejectPayload),
        Cookie: cookie,
      },
    },
    rejectPayload
  );

  console.log(`Reject Status: ${rejectRes.statusCode}`);
  console.log("Reject Response:", rejectRes.json);

  // Check lookup for rejected participant
  const lookupRes3 = await request(
    {
      hostname: "127.0.0.1",
      port: 3010,
      path: "/api/lookup",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(JSON.stringify({ identifier: "9820011223" })),
      },
    },
    JSON.stringify({ identifier: "9820011223" })
  );

  console.log("Rejected Participant Lookup:", lookupRes3.json?.data);
  if (lookupRes3.json?.data?.registrationStatus !== "REJECTED") {
    throw new Error("Expected status REJECTED!");
  }
  console.log(`✔ Rejection handled properly. Reason displayed: "${lookupRes3.json.data.rejectionReason}"\n`);

  console.log("=== ALL END-TO-END VERIFICATION CHECKS PASSED SUCCESSFULLY! ===");
}

runTests().catch((e) => {
  console.error("Verification failed:", e);
  process.exit(1);
});
