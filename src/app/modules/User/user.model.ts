import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { UserRoleForEnum, UserStatus } from './user.constant';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: { type: String, required: [true, 'Name is required!!!'] },
    email: {
      type: String,
      unique: true,
      required: [true, 'User Email is required!!!'],
    },
    password: {
      type: String,
      required: [true, 'Password is required!!!'],
      select: 0,
    },
    role: {
      type: String,
      enum: {
        values: [...UserRoleForEnum],
        message: '{VALUE} is not supported',
      },
    },
    status: {
      type: String,
      enum: {
        values: [...UserStatus],
        message: '{VALUE} is not supported',
      },
      default: 'active',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );

  next();
});

userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  const userAlreadyExist = await User.findOne({ email }).select('+password');

  return userAlreadyExist;
};

userSchema.statics.isUserPasswordMatched = async function (
  plainText: string,
  hashText: string,
) {
  return await bcrypt.compare(plainText, hashText);
};

export const User = model<TUser, UserModel>('User', userSchema);
