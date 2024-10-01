// import { HttpStatus, NotFoundException } from '@nestjs/common';
// import {
//   FilterQuery,
//   Model,
//   Types,
//   UpdateQuery,
//   SaveOptions,
//   Connection,
//   Document,
//   ClientSession,
// } from 'mongoose';
// import { LoggerService } from 'src/logger';
// import AppError from 'src/utils/app-error.utils';

// export abstract class AbstractRepository<TDocument extends Document> {
//   logger = new LoggerService();
//   constructor(
//     protected readonly model: Model<TDocument>,
//     private readonly connection: Connection,
//   ) {}

//   async create(
//     document: Partial<Omit<TDocument, '_id'>> & { _id?: Types.ObjectId },
//     options?: SaveOptions,
//   ): Promise<TDocument> {
//     if ('email' in document) {
//       const email = (document as any).email;

//       const existingDocument = await this.model.findOne({ email }).exec();
//       if (existingDocument) {
//         this.logger.warn('Document with this email already exists', { email });
//         throw new AppError('Email already in use.', HttpStatus.CONFLICT);
//       }
//     }

//     const createdDocument = new this.model({
//       ...document,
//       _id: document._id || new Types.ObjectId(),
//     });
//     return createdDocument.save({ ...options });
//   }

//   async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
//     const document = await this.model.findOne(filterQuery).lean().exec();

//     if (document) {
//       return document as unknown as TDocument;
//     }

//     return null;
//   }

//   async findOneAndUpdate(
//     filterQuery: FilterQuery<TDocument>,
//     update: UpdateQuery<TDocument>,
//   ): Promise<TDocument> {
//     const document = await this.model
//       .findOneAndUpdate(filterQuery, update, {
//         lean: true,
//         new: true,
//       })
//       .exec();

//     if (!document) {
//       this.logger.warn(`Document not found with filterQuery:`, filterQuery);
//       throw new NotFoundException('Document not found.');
//     }

//     return document as unknown as TDocument;
//   }

//   async upsert(
//     filterQuery: FilterQuery<TDocument>,
//     document: Partial<TDocument>,
//   ): Promise<TDocument> {
//     const upsertedDocument = await this.model
//       .findOneAndUpdate(filterQuery, document, {
//         lean: true,
//         upsert: true,
//         new: true,
//       })
//       .exec();

//     return upsertedDocument as unknown as TDocument;
//   }

//   async delete(
//     filterQuery: FilterQuery<TDocument>,
//     session?: ClientSession,
//   ): Promise<TDocument | null> {
//     try {
//       const deletedDocument = await this.model
//         .findOneAndDelete(filterQuery, { session })
//         .exec();
//       if (!deletedDocument) {
//         this.logger.warn('Document not found for deletion', filterQuery);
//         throw new NotFoundException('Document not found for deletion.');
//       }
//       return deletedDocument as TDocument;
//     } catch (error) {
//       this.logger.error('Error deleting document', error.message);
//       throw new AppError(
//         'Error deleting document',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }

//   async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
//     return this.model
//       .find(filterQuery, {}, { lean: true })
//       .exec() as unknown as TDocument[];
//   }

//   async startTransaction(): Promise<ClientSession> {
//     const session = await this.connection.startSession();
//     session.startTransaction();
//     return session;
//   }
// }
import { Model, Types } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import AppError from 'src/utils/app-error.utils';
import { sanitizeInput } from 'src/utils/sanitize.utils';

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const sanitizedData = sanitizeInput(data);
    return this.model.create(sanitizedData);
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<T> {
    const sanitizedId = sanitizeInput(id);
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const entity = await this.model.findById(sanitizedId).exec();
    if (!entity) {
      throw new AppError('Entity not found', HttpStatus.NOT_FOUND);
    }

    return entity;
  }

  async findOne(query: Partial<T>): Promise<T | null> {
    const sanitizedQuery = sanitizeInput(query);
    return this.model.findOne(sanitizedQuery).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const sanitizedId = sanitizeInput(id);
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const sanitizedData = sanitizeInput(data);
    const updatedEntity = await this.model
      .findByIdAndUpdate(sanitizedId, sanitizedData, { new: true })
      .exec();

    if (!updatedEntity) {
      throw new AppError('Entity not found', HttpStatus.NOT_FOUND);
    }

    return updatedEntity;
  }

  async delete(id: string): Promise<void> {
    const sanitizedId = sanitizeInput(id);
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const deletedEntity = await this.model.findByIdAndDelete(sanitizedId).exec();
    if (!deletedEntity) {
      throw new AppError('Entity not found', HttpStatus.NOT_FOUND);
    }
  }
}
