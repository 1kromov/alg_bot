// src/models/question.model.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../core/db.js';

export const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option3: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  option4: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correctOption: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});
