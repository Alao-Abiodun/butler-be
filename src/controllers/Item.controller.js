const { isEmpty } = require('lodash');
const Item = require('../models/items.model');

const { successResponse } = require('../utils/responses');

class ItemController {
  constructor(dependencies = {}) {
    this.dependencies = dependencies;
    this.logger = dependencies.logger;
    this.e = this.dependencies.errors;
    // this.indexer = this.dependencies.IndexItem('item');
    this.createItem = this.createItem.bind(this);
    this.getAllItems = this.getAllItems.bind(this);
    // this.getItemById = this.getItemById.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
  }

  async createItem(req, res) {

    const itemExist = await Item.findOne({ name: req.body.name }).lean();
    if (!isEmpty(itemExist)) {
      throw new this.e.BadRequestError(`Item with ${req.body.name} already exists, Please use a different name`);
    }

    const item = await Item.create(req.body);

    this.logger.info(`Item ${item.name} created successfully.`);
    // eslint-disable-next-line camelcase
    return successResponse(res, 201, item, `${item.name} created successfully`);
  }

  async getItemById(req, res) {
    this.logger.info('Request to fetch categories by id');
    const query = { _id: req.params.item_id };
    if (req.user && req.user.role === 'CUSTOMER') {
      query.visible = true;
    }
    const item = await Item.findOne(query)
    .populate('categories')
    // .populate('category', 'name slug icon images')
    .lean();
    if (isEmpty(item)) {
      throw new this.e.DocumentMissingError('Item not found');
    }
    this.logger.info('Item fetched successfully.');
    return successResponse(res, 200, item, 'Item fetched successfully');
  }

  async getAllItems(req, res) {
    this.logger.info('Request to fetch all item');
    const query = { visible: true };
    if (req.user && req.user.role === 'SUPER_ADMIN') {
      delete query.visible;
    }
    if (req.query.slug) {
      query.slug = req.query.slug;
    }

    let item = await Item.find(query).populate('categories').lean();

    if (isEmpty(item)) {
      throw new this.e.DocumentMissingError('Item not found');
    }
    this.logger.info('Item fetched successfully.');
    return successResponse(res, 200, item, 'Item fetched successfully');
  }

  async updateItem(req, res) {
    this.logger.info('Request to update item');
    const item = await Item.findByIdAndUpdate(req.params.item_id,
      req.body, { new: true });
    if (isEmpty(item)) {
      throw new this.e.DocumentMissingError('Item not found');
    }
    this.logger.info('Item updated successfully.');
    return successResponse(res, 200, item, 'Item updated successfully');
  }

  async deleteItem(req, res) {
    this.logger.info('Request to delete item');
    const item = await Item.findByIdAndDelete(req.params.item_id);
    if (isEmpty(item)) {
      throw new this.e.DocumentMissingError('Item not found');
    }
    this.logger.info('Item deleted successfully.');
    return successResponse(res, 200, {}, 'Item deleted successfully');
  }
}

module.exports = ItemController;
