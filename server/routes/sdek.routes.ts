import { getPoints } from './../sdekAPI/staticData';
import { Router } from "express";
import PointsModel from '../models/PointsModel';

const router = Router()

router.post('/update-pvz', async (req, res) => {
    try {
        const points = await getPoints()
        const pointsInDb = await PointsModel.find()

        const deletedIds = pointsInDb.filter(({ code }) => !points.some(item => item.code === code)).map(({ _id }) => _id)
        await PointsModel.deleteMany({ _id: { $in: deletedIds } })

        for (const i in points) {
            const point = points[i]
            const pointInDb = pointsInDb.find(({ code }) => code === point.code)?._id
            if ( pointInDb ) {
                await PointsModel.findByIdAndUpdate(pointInDb, point)
            }
            else {
                await new PointsModel(point).save()
            }
        }

        return res.end()
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

export default router