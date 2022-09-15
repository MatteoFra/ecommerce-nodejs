const Product = require("../models/productModel");
const { StatusCodes } = require("http-status-codes");

exports.createProduct = async (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "ok",
  });
};
exports.getAllProducts = async (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "ok",
  });
};
exports.getSingleProduct = async (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "ok",
  });
};
exports.updateProduct = async (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "ok",
  });
};
exports.deleteProduct = async (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "ok",
  });
};
exports.uploadImage = async (req, res) => {
  res.status(StatusCodes.OK).json({
    msg: "ok",
  });
};
