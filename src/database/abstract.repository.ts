import { NotFoundException } from '@nestjs/common';
import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
  Document,
  ClientSession,
} from 'mongoose';
import { LoggerService } from 'src/logger';
import AppError from 'src/utils/app-error';

export abstract class AbstractRepository<TDocument extends Document> {
  logger = new LoggerService();
  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(
    document: Partial<Omit<TDocument, '_id'>> & { _id?: Types.ObjectId },
    options?: SaveOptions,
  ): Promise<TDocument> {
    if ('email' in document) {
      const email = (document as any).email;

      const existingDocument = await this.model.findOne({ email }).exec();
      if (existingDocument) {
        this.logger.warn('Document with this email already exists', { email });
        throw new AppError('0002', 'Email already in use.');
      }
    }

    const createdDocument = new this.model({
      ...document,
      _id: document._id || new Types.ObjectId(),
    });
    return createdDocument.save({ ...options });
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery).lean().exec();

    if (document) {
      return document as unknown as TDocument;
    }

    return null;

  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    }).exec();

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document as unknown as TDocument;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ): Promise<TDocument> {
    const upsertedDocument = await this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    }).exec();

    return upsertedDocument as unknown as TDocument;
  }

  async delete(filterQuery: FilterQuery<TDocument>, session?: ClientSession): Promise<TDocument | null> {
    try {
      const deletedDocument = await this.model.findOneAndDelete(filterQuery, { session }).exec();
      if (!deletedDocument) {
        this.logger.warn('Document not found for deletion', filterQuery);
        throw new NotFoundException('Document not found for deletion.');
      }
      return deletedDocument as TDocument;
    } catch (error) {
      this.logger.error('Error deleting document', error.message);
      throw new AppError('0002', 'Error deleting document');
    }
  }

  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery, {}, { lean: true }).exec() as unknown as TDocument[];
  }

  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
