import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Values extends BaseModel {
  @column()
  public m: number

  @column()
  public n: number
}
