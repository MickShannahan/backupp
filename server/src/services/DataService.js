import { dbContext } from "../db/DbContext.js"



class DataService {
  async getFolderData(folder) {
    const data = await dbContext.Files.aggregate([{
      $match: {
        folder: { $regex: new RegExp(folder) }
      }
    },
    {
      $group: {
        _id: "$ownerId",
        totalSize: { $sum: "$size" }
      }
    }
    ])
    return data
  }

}

export const dataService = new DataService()
