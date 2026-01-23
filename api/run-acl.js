export default async function handler(req, res) {
  try {
    const steps = [];

    // -------------------------------
    // STEP 1: HARDCODED ACCESS TOKEN
    // -------------------------------
    const ACCESS_TOKEN = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiI4NjlkYWZhYS0xOGI5LTQwMjAtYTNkYS02Y2VhZmZiY2Q2ZmUiLCJpc3MiOiJodHRwczovL20yaXRlc3QuYjJjbG9naW4uY29tLzVhNjc0ODc0LTA5MmMtNDA2NS1iMmMxLWIzOTlhODZhNzVhZS92Mi4wLyIsImV4cCI6MTc2OTE2NDE1NiwibmJmIjoxNzY5MTYwNTU2LCJvaWQiOiJlODIzYWFlNC02YmRmLTQxMmItODQ2NS05NTQ3NmEwYmFlNDMiLCJzdWIiOiJlODIzYWFlNC02YmRmLTQxMmItODQ2NS05NTQ3NmEwYmFlNDMiLCJnaXZlbl9uYW1lIjoiYXNkIiwibmFtZSI6ImFzZCIsImVtYWlscyI6WyJudXB1ckBkaHhzb2Z0d2FyZS5jb20iXSwidGZwIjoiQjJDXzFfTTJJX1NpZ25JbiIsInNjcCI6ImRlbW8ucmVhZCIsImF6cCI6Ijg2OWRhZmFhLTE4YjktNDAyMC1hM2RhLTZjZWFmZmJjZDZmZSIsInZlciI6IjEuMCIsImlhdCI6MTc2OTE2MDU1Nn0.ju3Eqhu8TBHqcropQhq5tHIAcoulLctBDk-9k7Vmmcz3S4UZxkLGz5G1kXq7faqzzBdRqoGNY_PH2vT1WBzWp_DC_fSsfoASMwoztOKtGp9nMll2sbob8tNn-jB787BX84oHDziXuw2QWnQdexoWSrYq4InDmC0DNypcZq79ZmSZKDxaTo-TTI4ktlr4m7o5FayPdmLGl8jKj9k_s67VNwxIJ02oVn3oG4Qd8hA5qk0hMB8W4aJ2KHVBpW4fzTfNn5b0hfPubay2qcdTGSUHos7h9MGmFFrPBtQLK50qzq5p01qYAX4aBL18q5QhBwgL8s4R1g0bkBSrR9l35AhoPA";

    if (!ACCESS_TOKEN || ACCESS_TOKEN.split(".").length !== 3) {
      steps.push({
        step: "TOKEN",
        status: "error",
        message: "Invalid or malformed access token"
      });
      return res.status(401).json({ success: false, steps });
    }

    steps.push({
      step: "TOKEN",
      status: "success",
      message: "Access token loaded"
    });

    // --------------------------------
    // STEP 2: DELETE SeedDatabase
    // --------------------------------
    const deleteResponse = await fetch(
      "https://m2i-test-api2.azurewebsites.net/api/SeedDatabase",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      }
    );

    const deleteResult = await deleteResponse.json();

    steps.push({
      step: "DELETE",
      status: deleteResult?.data === true ? "success" : "error",
      message: JSON.stringify(deleteResult)
    });

    if (deleteResult?.data !== true) {
      return res.status(400).json({ success: false, steps });
    }

    // --------------------------------
    // STEP 3: GET SeedDatabase
    // --------------------------------
    const getResponse = await fetch(
      "https://m2i-test-api2.azurewebsites.net/api/SeedDatabase",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`
        }
      }
    );

    const getResult = await getResponse.json();

    steps.push({
      step: "GET",
      status: "success",
      message: JSON.stringify(getResult)
    });

    // --------------------------------
    // DONE
    // --------------------------------
    return res.json({
      success: true,
      steps,
      message: "✅ ACL run completed successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      steps: [
        {
          step: "SYSTEM",
          status: "error",
          message: err.message
        }
      ]
    });
  }
}
