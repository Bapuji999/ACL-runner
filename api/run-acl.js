export default async function handler(req, res) {
  try {
    // DELETE call
    const deleteRes = await fetch(
      "https://m2i-test-api2.azurewebsites.net/api/SeedDatabase",
      { method: "DELETE" }
    );

    const deleteData = await deleteRes.json();

    // Check condition
    if (deleteData.data === true) {

      // GET call
      const getRes = await fetch(
        "https://m2i-test-api2.azurewebsites.net/api/SeedDatabase"
      );
      const getData = await getRes.json();

      return res.status(200).json({
        deleteResponse: deleteData,
        getResponse: getData,
        message: "ACL run completed"
      });
    }

    return res.status(400).json({
      deleteResponse: deleteData,
      message: "ACL run failed"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
