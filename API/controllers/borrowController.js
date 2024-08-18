const sanitize = require("../helpers/sanitize");
const response = require("../helpers/response");
const { Book, Member, Borrow, Suspend, sequelize } = require("../models");
const { Sequelize, Op } = require("sequelize");

const moment = require("moment");
const { json } = require("sequelize");
moment.locale("id");

exports.borrowBook = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const body = {
      member_code: req.body.member_code
        ? sanitize.escapeHtmlPlus(req.body.member_code)
        : "",
      book_code: req.body.book_code
        ? sanitize.escapeHtmlPlus(req.body.book_code)
        : "",
      time_borrow: req.body.time_borrow
        ? moment(req.body.time_borrow).format("YYYY-MM-DD")
        : "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return response.jsonBadRequest(`field ${key} must be fill`, res, "");
      }
    }

    /** cek member */
    const dataMember = await Member.findOne({
      where: { code: body.member_code },
      attributes: ["id", "code", "name"],
    });

    if (!dataMember) {
      return response.jsonNotFound("Member not found", res);
    }

    const memberBorrow = await Borrow.findAll({
      where: { member_code: body.member_code },
      attributes: ["id", "member_code"],
    });

    if (memberBorrow.length >= 2) {
      return response.jsonBadRequest("Member already borrow 2 book", res, "");
    }

    const memberSuspend = await Suspend.findOne({
      where: {
        member_code: body.member_code,
        status: 1,
        time_suspend: {
          [Op.lte]: new Date(
            new Date(body.time_borrow).setHours(0, 0, 0, 0) -
              3 * 24 * 60 * 60 * 1000
          ),
        },
      },
    });

    if (memberSuspend) {
      return response.jsonBadRequest(
        memberSuspend,
        res,
        "Can't borrow because member is suspend"
      );
    }

    /** check book */
    const dataBook = await Book.findOne({
      where: {
        code: body.book_code,
        stock: {
          [Op.gte]: 1,
        },
      },
      attributes: ["id", "code", "title", "author", "stock"],
    });

    if (!dataBook) {
      return response.jsonNotFound("Book not found", res);
    }

    // insert to table borrow and update book stock
    const insertBorrow = await Borrow.create(
      {
        member_code: body.member_code,
        book_code: body.book_code,
        time_borrow: body.time_borrow,
        status: 1,
      },
      { transaction: t }
    );

    await Book.update(
      {
        stock: Sequelize.literal("stock - 1"),
      },
      {
        where: { id: dataBook.id },
      },
      { transaction: t }
    );

    await t.commit();

    return response.jsonBerhasil(insertBorrow, res, "Success borrow book");
  } catch (err) {
    await t.rollback();
    console.log("err", err);
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

exports.returnBook = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const body = {
      member_code: req.body.member_code
        ? sanitize.escapeHtmlPlus(req.body.member_code)
        : "",
      book_code: req.body.book_code
        ? sanitize.escapeHtmlPlus(req.body.book_code)
        : "",
      time_return: req.body.time_return
        ? moment(req.body.time_return).format("YYYY-MM-DD")
        : "",
    };

    for (const key in body) {
      if (body[key] == "") {
        return response.jsonBadRequest(`field ${key} must be fill`, res, "");
      }
    }

    /** check borrow */
    const borrowedBook = await Borrow.findOne({
      where: {
        member_code: body.member_code,
        book_code: body.book_code,
        status: 1,
      },
    });

    if (!borrowedBook) {
      return response.jsonNotFound("Borrow data is not found", res);
    }

    if (
      moment(borrowedBook.time_borrow).add(7, "days").format("YYYY-MM-DD") <
      body.time_return
    ) {
      // insert suspend
      await Suspend.create(
        {
          member_code: body.member_code,
          time_suspend: new Date(body.time_return),
        },
        { transaction: t }
      );
    }

    // update borrow and book stock
    await Borrow.update(
      {
        time_return: body.time_return,
      },
      {
        where: { id: borrowedBook.id },
      },
      { transaction: t }
    );

    await Book.update(
      {
        stock: Sequelize.literal("stock + 1"),
      },
      {
        where: { code: body.book_code },
      },
      { transaction: t }
    );

    return response.jsonBerhasil("", res, "Success return book");
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

exports.checkMember = async (req, res) => {
  try {
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};

exports.checkBook = async (req, res) => {
  try {
  } catch (err) {
    console.log("err", err);
    res.status(500).json({
      metadata: {
        status: 500,
        message: "FAILED",
      },
      response: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
    });
  }
};
