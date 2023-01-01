const { isEmpty } = require('lodash');
const { Schema } = require('mongoose');
const Category = require('../models/category.model');
const Service = require('../models/service.model');

const { successResponse } = require('../utils/responses');

class CategoryController {
  constructor(dependencies = {}) {
    this.dependencies = dependencies;
    this.logger = dependencies.logger;
    this.e = this.dependencies.errors;
    // this.indexer = this.dependencies.IndexCategory(c 'category');
    this.createCategory = this.createCategory.bind(this);
    this.getAllCategories = this.getAllCategories.bind(this);
    this.getCategoryById = this.getCategoryById.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.addItemToCategory  =this.addItemToCategory.bind(this);
  }

  async createCategory(req, res) {
    const promises = [Category.findOne({ name: req.body.name }).lean(), Service.findById(req.body.service)]
    const [categoryExist, service] = await Promise.all(promises);
    if (!isEmpty(categoryExist)) {
      throw new this.e.BadRequestError(`Category with ${req.body.name} already exists, Please use a different name`);
    }

    if (isEmpty(service)) {
      throw new this.e.DocumentMissingError('Service not found');
    }

    req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    const category = await Category.create(req.body);

    service.categories.push(category._id);
    await service.save()

    this.logger.info(`Category ${category.name} added successfully.`);
    // eslint-disable-next-line camelcase
    return successResponse(res, 201, category, `${category.name} added successfully`);
  }

  async getCategoryById(req, res) {
    this.logger.info('Request to fetch categories by id');
    const query = { _id: req.params.category_id };
    if (req.user.role === 'CUSTOMER') {
      query.visible = true;
    }
    const category = await Category.findOne(query)
      .populate('sales_item.item')

    // .populate('categories', 'name slug icon images')
    // .populate('category', 'name slug icon images')
    .lean();
    if (isEmpty(category)) {
      throw new this.e.DocumentMissingError('Category not found');
    }
    this.logger.info('Category fetched successfully.');
    return successResponse(res, 200, category, 'Category fetched successfully');
  }

  async getAllCategories(req, res) {
    this.logger.info('Request to fetch all category');
    const query = { visible: true };
    if (req.user && req.user.role === 'SUPER_ADMIN') {
      delete query.visible;
    }
    if (req.query.slug) {
      query.slug = req.query.slug;
    }
    if (req.query.service) {
      query.slug = req.query.service;
    }

    let category = await Category.find(query)
    .populate('sales_item.item')
    .lean();

    if (isEmpty(category)) {
      throw new this.e.DocumentMissingError('Category not found');
    }
    this.logger.info('Category fetched successfully.');
    return successResponse(res, 200, category, 'Category fetched successfully');
  }

  async updateCategory(req, res) {
    this.logger.info('Request to update category');
    const category = await Category.findByIdAndUpdate(req.params.category_id,
      req.body, { new: true });
    if (isEmpty(category)) {
      throw new this.e.DocumentMissingError('Category not found');
    }
    this.logger.info('Category updated successfully.');
    return successResponse(res, 200, category, 'Category updated successfully');
  }

  async deleteCategory(req, res) {
    this.logger.info('Request to delete category');
    const category = await Category.findByIdAndDelete(req.params.category_id);
    if (isEmpty(category)) {
      throw new this.e.DocumentMissingError('Category not found');
    }
    this.logger.info('Category deleted successfully.');
    return successResponse(res, 200, {}, 'Category deleted successfully');
  }

  async addItemToCategory(req, res) {
    this.logger.info('Request to add item to category');
    const category = await Category.findById(req.params.category_id);
    if (isEmpty(category)) {
      throw new this.e.DocumentMissingError('Category not found');
    }
    
    let itemIndex;
    category.sales_item.forEach((x, index)=> {
      if (x.item === req.body.item) {
        itemIndex = index
      }
    })
    if (itemIndex) {
      category.sales_item[itemIndex] = req.body;
    } else {
      category.sales_item.push(req.body);
    }
    category.markModified('sales_item');
    await category.save();

    this.logger.info(`Item ${req.body.name} added successfully.`);
    // eslint-disable-next-line camelcase
    return successResponse(res, 201, req.body, `Item added successfully`);
  }

  async removeItemFromCategory(req, res) {
    this.logger.info('Request to remove item from category');
    const category = await Category.findByIdAndUpdate(req.params.category_id, 
      { $pull: { sales_item: { _id: req.body.item } } });
    if (isEmpty(category)) {
      throw new this.e.DocumentMissingError('Category not found');
    }

    this.logger.info(`Item ${req.body.name} removed successfully.`);
    // eslint-disable-next-line camelcase
    return successResponse(res, 201, req.body, `${req.body.name} removed successfully`);
  }
}

module.exports = CategoryController;
