const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();
exports.getCost = async (req, res) => {
  try {
    const { origin, destination, weight, courier } = req.body;

    // Cari ID kota asal
    const checkCity1 = await prisma.city.findFirst({
      where: {
        name: {
          contains: origin,
          mode: "insensitive",
        },
      },
    });
    console.log("CheckCity1:", checkCity1);

    // Cari ID kota tujuan
    const checkCity2 = await prisma.city.findFirst({
      where: {
        name: {
          contains: destination,
          mode: "insensitive",
        },
      },
    });
    if (!checkCity1 || !checkCity2) {
      return res
        .status(400)
        .json({ status: "error", message: "City not found" });
    }

    const originId = JSON.stringify(checkCity1.id);
    const destinationId = JSON.stringify(checkCity2.id);
    const weightInt = parseInt(weight);

    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        key: process.env.ONGKIR_KEY,
      },
      body: `origin=${originId}&destination=${destinationId}&weight=${weightInt}&courier=${courier}`,
    };

    const response = await fetch(
      "https://api.rajaongkir.com/starter/cost",
      requestOptions
    );

    const data = await response.json();

    res.status(200).json({
      status: "success",
      message: "Cost fetched successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch cities",
    });
  }
};
