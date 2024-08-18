const express = require("express");
const borrowController = require("./controllers/borrowController");
const router = express.Router();

/** borrow routes */
/**
 * @swagger
 * /api/v1/borrow:
 *  post:
 *   summary: Member return a book
 *   description: update to table borrow for one book return
 *   requestBody: {
 *    content: {
 *     application/json: {
 *      schema: {
 *       type: object,
 *       properties: {
 *        member_code: {
 *          type: string,
 *          example: M001
 *        },
 *        book_code: {
 *          type: string,
 *          example: jk-45
 *        },
 *        time_return: {
 *          type: date,
 *          example: 2024-08-19
 *        },
 *       }
 *      }
 *     }
 *    }
 *   }
 *   responses: {
 *    200: {
 *      description: Success Return a book,
 *      content: {
 *       application/json: {
 *        schema: {
 *         type: object,
 *         properties: {
 *          message: {
 *           type: string
 *          }
 *         }
 *        }
 *       }
 *      }
 *    }
 *   }
 */
router.post("/api/v1/borrow", borrowController.borrowBook);
/** borrow routes */
/**
 * @swagger
 * /api/v1/return:
 *  post:
 *   summary: Member borrow a book
 *   description: insert to table borrow for one book borrow for one member
 *   requestBody: {
 *    content: {
 *     application/json: {
 *      schema: {
 *       type: object,
 *       properties: {
 *        member_code: {
 *          type: string,
 *          example: M001
 *        },
 *        book_code: {
 *          type: string,
 *          example: jk-45
 *        },
 *        time_borrow: {
 *          type: date,
 *          example: 2024-08-17
 *        },
 *       }
 *      }
 *     }
 *    }
 *   }
 *   responses: {
 *    200: {
 *      description: Success Borrow a book,
 *      content: {
 *       application/json: {
 *        schema: {
 *         type: object,
 *         properties: {
 *          message: {
 *           type: string
 *          }
 *         }
 *        }
 *       }
 *      }
 *    }
 *   }
 */
router.post("/api/v1/return", borrowController.returnBook);

/**
 * @swagger
 * /api/v1/check-member:
 *  get:
 *   summary: Return data of each member
 *   responses:
 *    200: {
 *     description: Check data member,
 *     content: {
 *      application/json: {
 *       schema: {
 *        type: object,
 *        properties: {
            message: {
                type: string,
                example: Success get data
            },
            data: {
                    type: array,
                    items: {
                        type: object,
                        properties: {
                          id: {
                            type: integer,
                            format: int64,
                            example: 1
                          },
                          code: {
                            type: string,
                            example: M001
                          },
                          name: {
                            type: string,
                            example: Angga
                          },
                          borrowed: {
                            type: integer,
                            format: int64,
                            example: 2
                          }
                        }
                      },
                      example: [
                        { id: 1, code: M001, name: Angga, borrowed: 2 },
                        { id: 2, code: M002, name: Ferry, borrowed: 1 }
                      ]
            }
          }
 *       } 
 *      }
 *     }
 *    }
 *     
 * 
 */
router.get("/api/v1/check-member", borrowController.checkMember);
/**
 * @swagger
 * /api/v1/check-book:
 *  get:
 *   summary: Return data of each book
 *   responses:
 *    200: {
 *     description: Check data book,
 *     content: {
 *      application/json: {
 *       schema: {
 *        type: object,
 *        properties: {
            message: {
                type: string,
                example: Success get data
            },
            data: {
                type: array,
                items: {
                    type: object,
                    properties: {
                        id: {
                            type: integer,
                            format: int64,
                            example: 1
                        },
                        code: {
                            type: string,
                            example: JK-45
                        },
                        title: {
                            type: string,
                            example: Harry Potter
                        },
                        author: {
                            type: String,
                            example: J.K Rowling
                        },
                        stock: {
                            type: integer,
                            format: int64,
                            example: 1
                        }
                    }
                    },
                    example: [
                        { id: 1, code: JK-45, title: Harry Potter, author: J.K Rowling, stock: 1 },
                        { id: 2, code: SHR-1, title: A study in Scarlet, author: Arthur Conan Doyle, stock: 1 }
                    ]
            }
          }
 *       } 
 *      }
 *     }
 *    }
 *     
 * 
 */
router.get("/api/v1/check-book", borrowController.checkBook);

/** Main routes */
/**
 * @swagger
 * /:
 *  get:
 *      summary: Return response sample message
 *      responses:
 *          200:
 *              description: Api ready to use!
 */
router.get("/", (req, res) => {
  res.status(200).json({
    metadata: {
      status: 200,
      message: "Api ready to use!",
    },
    response: {
      data: {
        name: "Backend Tes Eigen Tri Mathema ",
      },
    },
  });
});
router.use((req, res) => {
  res.status(404).json({
    metadata: {
      status: 404,
      message: "FAIL",
    },
    response: {
      data: {
        name: "NotFoundError",
        message: "Are you lost?",
      },
    },
  });
});
router.use((err, req, res, next) => {
  res.status(500).json({
    metadata: {
      status: 500,
      message: "ERROR",
    },
    response: {
      data: {
        name: "InternalServerError",
        message: err.message,
        stack: err.stack,
      },
    },
  });
});

module.exports = router;
