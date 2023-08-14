import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Values from 'App/Models/Values'
import Index from 'App/Models/Index'

import fs from 'fs'

interface DataStructure {
  value: number
}

function loadGeneratedValues() {
  const __dirname: string = './generated/'
  const regex = new RegExp('values[0-9]*.json')
  const files = fs.readdirSync(__dirname)
  const values: number[] = []
  let data: string = ''
  let parseData: DataStructure = { value: 0 }
  files.forEach(function (file) {
    if (regex.test(file)) {
      data = fs.readFileSync(__dirname + file, 'utf-8')
      parseData = JSON.parse(data) as DataStructure
      values.push(parseData.value)
    }
  })

  return values
}

export default class ValuesController {
  public async generate({ request, response }: HttpContextContract) {
    try {
      const data = request.only(['m', 'n']) as Values
      var numArray: number[] = []

      let value
      for (var i = 0; i < data.n; i++) {
        value = Math.random() * (data.m - 0) + 0
        fs.writeFileSync('./generated/values' + i + '.json', JSON.stringify({ value: value }))
        numArray.push(value)
      }

      return response.created(numArray)
    } catch (e) {
      return response.send({ error: e })
    }
  }

  public async operate({ response }: HttpContextContract) {
    try {
      const allValues = loadGeneratedValues()
      let sumAll = 0
      for (var i = 0; i < allValues.length; i++) {
        sumAll += allValues[i]
      }

      const maxVal: number = Math.max(...allValues)
      const minVal: number = Math.min(...allValues)

      return response.created({ values: allValues, sum: sumAll, max: maxVal, min: minVal })
    } catch (e) {
      return response.send({ error: e })
    }
  }

  public async getPosition({ request, response }: HttpContextContract) {
    try {
      const index = request.only(['i']) as Index
      const allValues = loadGeneratedValues()

      if (index.i < allValues.length) {
        return response.send({ nth_value: allValues[index.i] })
      }
      return response.send({ warn: 'out of range' })
    } catch (e) {
      return response.send({ error: e })
    }
  }
}
