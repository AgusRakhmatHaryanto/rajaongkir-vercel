const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const prisma = new PrismaClient();

exports.initAllCity = async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/city",
      headers: {
        key: `${process.env.ONGKIR_KEY}`,
      },
    };

    const response = await axios.request(options);
    const data = response.data.rajaongkir.results;

    const cities = data.map((item) => ({
      id: Number(item.city_id),
      name: item.type + " " + item.city_name,
      province_id: Number(item.province_id),
      type: item.type,
      postal_code: Number(item.postal_code),
    }));

    for (const city of cities) {
      const existingCity = await prisma.city.findFirst({
        where: {
          name: city.name,
        },
      });

      if (!existingCity) {
        await prisma.city.create({
          data: city,
        });
      }
    }

    res.status(200).json({
      status: "success",
      message: "Data cities fetched and saved successfully",
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch cities",
    });
  }
};


exports.getAllCity = async (req, res) => {
  try {
    const cities = await prisma.city.findMany();
    res.status(200).json({
      status: "success",
      data: cities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch cities",
    });
  }
}


exports.getCityByName = async (req, res) => {
  try {
    const { name } = req.params;
    const city = await prisma.city.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
    res.status(200).json({
      status: "success",
      data: city,
    });
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch city",
    });
  }
}