const { MongoClient } = require("mongodb");

async function updateValidation() {
  const client = new MongoClient(
    "mongodb+srv://lijinhai255:ADeQx1Hyj8JRDZtF@cluster0.m2ayv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );

  try {
    await client.connect();
    const mydb = client.db("mydb");
    await mydb.command({
      collMod: "courses",
      validator: {},
      validationLevel: "off",
    });
    console.log("Validation schema updated.");
  } catch (err) {
    console.error("Error updating validation schema:", err);
  } finally {
    await client.close();
  }
}

updateValidation().catch(console.error);
