const { isEmpty } = require('lodash');
const Service = require('../models/service.model');

const { successResponse } = require('../utils/responses');

class ServiceController {
  constructor(dependencies = {}) {
    this.dependencies = dependencies;
    this.logger = dependencies.logger;
    this.e = this.dependencies.errors;
    // this.indexer = this.dependencies.IndexService('service');
    this.createService = this.createService.bind(this);
    this.getAllServices = this.getAllServices.bind(this);
    this.getServiceById = this.getServiceById.bind(this);
    this.deleteService = this.deleteService.bind(this);
    this.updateService = this.updateService.bind(this);
  }

  async createService(req, res) {

    const serviceExist = await Service.findOne({ name: req.body.name }).lean();
    if (!isEmpty(serviceExist)) {
      throw new this.e.BadRequestError(`Service with ${req.body.name} already exists, Please use a different name`);
    }

    req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]/gi, '-');
    const service = await Service.create(req.body);

    this.logger.info(`Service ${service.name} created successfully.`);
    // eslint-disable-next-line camelcase
    return successResponse(res, 201, service, `${service.name} created successfully`);
  }

  async getServiceById(req, res) {
    this.logger.info('Request to fetch categories by id');
    const query = { _id: req.params.service_id };
    if (req.user && req.user.role === 'CUSTOMER') {
      query.visible = true;
    }
    const service = await Service.findOne(query)
    .populate('categories')
    // .populate('category', 'name slug icon images')
    .lean();
    if (isEmpty(service)) {
      throw new this.e.DocumentMissingError('Service not found');
    }
    this.logger.info('Service fetched successfully.');
    return successResponse(res, 200, service, 'Service fetched successfully');
  }

  async getAllServices(req, res) {
    this.logger.info('Request to fetch all service');
    const query = { visible: true };
    if (req.user && req.user.role === 'SUPER_ADMIN') {
      delete query.visible;
    }
    if (req.query.slug) {
      query.slug = req.query.slug;
    }

    let service = await Service.find(query).populate('categories').lean();

    if (isEmpty(service)) {
      throw new this.e.DocumentMissingError('Service not found');
    }
    this.logger.info('Service fetched successfully.');
    return successResponse(res, 200, service, 'Service fetched successfully');
  }

  async updateService(req, res) {
    this.logger.info('Request to update service');
    const service = await Service.findByIdAndUpdate(req.params.service_id,
      req.body, { new: true });
    if (isEmpty(service)) {
      throw new this.e.DocumentMissingError('Service not found');
    }
    this.logger.info('Service updated successfully.');
    return successResponse(res, 200, service, 'Service updated successfully');
  }

  async deleteService(req, res) {
    this.logger.info('Request to delete service');
    const service = await Service.findByIdAndDelete(req.params.service_id);
    if (isEmpty(service)) {
      throw new this.e.DocumentMissingError('Service not found');
    }
    this.logger.info('Service deleted successfully.');
    return successResponse(res, 200, {}, 'Service deleted successfully');
  }
}

module.exports = ServiceController;
