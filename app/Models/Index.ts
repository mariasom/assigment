import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Index extends BaseModel {
  @column()
  public i: number
}
