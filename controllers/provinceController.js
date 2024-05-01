const { PrismaClient } = require("@prisma/client");
const axios = require("axios")

const prisma = new PrismaClient();

exports.initAllProvince = async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/province",
      headers: {
        key: process.env.ONGKIR_KEY,
      },
    };

    const response = await axios.request(options);
    const data = response.data.rajaongkir.results;

    for (const item of data) {
      const provinceId = item.province_id;
      const provinceName = item.province;

      const existingProvince = await prisma.province.findFirst({
        where: {
          name: provinceName,
        },
      });

      if (!existingProvince) {
        await prisma.province.create({
          data: {
            id: Number(provinceId),
            name: provinceName,
          },
        });
      } else {
        await prisma.province.update({
          where: {
            id: Number(provinceId),
          },
          data: {
            name: provinceName,
          },
        });
      }
    }

    res.status(200).json({
      status: "success",
      message: "Data province has been initialized",
    });
  } catch (error) {
    console.error("Error initializing provinces:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to initialize provinces",
    });
  }
};


exports.getAllProvince = async (req, res) => {
  try {
    const provinces = await prisma.province.findMany();
    res.status(200).json({
      status: "success",
      data: provinces,
    });
  } catch (error) {
    console.error("Error fetching provinces:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch provinces",
    });
  }
}


exports.getProvinceByName = async (req, res) => {
  try {
    const { name } = req.params;
    const province = await prisma.province.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive",
        },
      },
    });
    res.status(200).json({
      status: "success",
      data: province,
    });
  } catch (error) {
    console.error("Error fetching province:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch province",
    });
  }
}


exports.getProvinceById = async (req, res) => {
  try {
    const { id } = req.params;
    const province = await prisma.province.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({
      status: "success",
      data: province,
    });
  } catch (error) {
    console.error("Error fetching province:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch province",
    });
  }
}