export default async function handler(req, res) {
  const result = {
    steps: [],
    success: false
  };

  try {
    /* =======================
       STEP 1: TOKEN
       ======================= */
    result.steps.push({ step: "TOKEN", status: "running" });

    const tokenRes = await fetch(
      "https://m2itest.b2clogin.com/m2itest.onmicrosoft.com/B2C_1_M2I_SignIn/oauth2/v2.0/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: "869dafaa-18b9-4020-a3da-6ceaffbcd6fe",
          scope: "https://m2itest.onmicrosoft.com/b2c-m2i-test/demo.read offline_access",
          code: process.env.B2C_AUTH_CODE,
          redirect_uri: "https://testservicing.azureedge.net/",
          client_secret: process.env.B2C_CLIENT_SECRET,
          code_verifier: process.env.B2C_CODE_VERIFIER
        })
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      result.steps[result.steps.length - 1] = {
        step: "TOKEN",
        status: "error",
        message: tokenData.error_description || "Invalid token response"
      };
      return res.status(400).json(result);
    }

    result.steps[result.steps.length - 1].status = "success";
    const accessToken = tokenData.access_token;

    /* =======================
       STEP 2: DELETE
       ======================= */
    result.steps.push({ step: "DELETE SeedDatabase", status: "running" });

    const deleteRes = await fetch(
      "https://m2i-test-api2.azurewebsites.net/api/SeedDatabase",
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const deleteData = await deleteRes.json();

    if (!deleteData?.data) {
      result.steps[result.steps.length - 1] = {
        step: "DELETE SeedDatabase",
        status: "error",
        message: "DELETE API failed",
        response: deleteData
      };
      return res.status(400).json(result);
    }

    result.steps[result.steps.length - 1].status = "success";

    /* =======================
       STEP 3: GET
       ======================= */
    result.steps.push({ step: "GET SeedDatabase", status: "running" });

    const getRes = await fetch(
      "https://m2i-test-api2.azurewebsites.net/api/SeedDatabase",
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const getData = await getRes.json();

    result.steps[result.steps.length - 1] = {
      step: "GET SeedDatabase",
      status: "success",
      response: getData
    };

    result.success = true;
    return res.status(200).json(result);

  } catch (err) {
    result.steps.push({
      step: "UNEXPECTED ERROR",
      status: "error",
      message: err.message
    });
    return res.status(500).json(result);
  }
}
