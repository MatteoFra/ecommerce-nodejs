const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermissions = require("../utils/checkPermissions");

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.status(StatusCodes.OK).json({
    orders,
  });
};

exports.createOrder = async (req, res) => {
  const { items, tax, shippingFee } = req.body;
  if (!items || items.length < 1) {
    throw new CustomError.BadRequestError("No item provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }
  let orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const { product: id, amount } = item;
    const product = await Product.findById(id);
    if (!product) {
      throw new CustomError.NotFoundError("No product with id");
    }
    const { name, price, image } = product;
    const singleOrderItem = {
      amount,
      name,
      price,
      image,
      product: id,
    };
    orderItems.push(singleOrderItem);
    subtotal += amount * price;
  }
  const total = tax + shippingFee + subtotal;
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    user: req.user.userID,
  });
  res.status(StatusCodes.CREATED).json({
    order,
  });
};

exports.getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    throw new CustomError.BadRequestError("No order found with that id");
  }
  res.status(StatusCodes.OK).json({
    order,
  });
};

exports.getCurrentUserOrders = async (req, res) => {
  const { userID } = req.user;
  const orders = await Order.find({ user: userID });
  res.status(StatusCodes.OK).json({
    orders,
  });
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const order = await Order.findById(id);
  if (!order) {
    throw new CustomError.BadRequestError("No order found with that id");
  }
  checkPermissions(user, order.user);
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({
    order,
  });
};
