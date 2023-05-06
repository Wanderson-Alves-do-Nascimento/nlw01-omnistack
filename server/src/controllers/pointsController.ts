import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query;
    console.log(city, uf, items);

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('recycle_points')
      .join('point_items', 'recycle_points.id', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('recycle_points.*')

    const serializedPoints = points.map(point => {
      return {
        ...point,
        image_url: `http://192.168.68.101:3333/uploads/${point.image}`
      };
    })
    return res.json(serializedPoints)
  }


  async show(req: Request, res: Response) {
    const { id } = req.params

    const point = await knex('recycle_points').where('id', id).first();
    if (!point) {
      return res.status(404).json({ message: 'Item not found' })
    }


    const serializedPoint = {
      ...point,
      image_url: `http://192.168.68.101:3333/uploads/${point.image}`
    }

    const items = await knex('recycle_items')
      .join('point_items', 'recycle_items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id);
    return res.json({ point: serializedPoint, items })
  };

  async create(req: Request, res: Response) {

    knex.transaction(function (trx) {

      const { name, email, latitude, longitude, city, uf, items } = req.body;
      const whatsapp = Number(req.body.whatsapp.replace(' ', '').replace('-',))

      const point = { image: req.file?.filename, name, email, whatsapp, latitude, longitude, city, uf }

      return trx('recycle_points').insert(point)
        .then(function (ids) {

          const pointItems = items.split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
              return {
                item_id,
                point_id: ids[0]
              }
            })
          return trx('point_items').insert(pointItems);
        })
    }).then(function (inserts) {
      console.log("Register updated");
      return res.json({
        message: "Data send was successful.",
        return: req.body
      })
    }).catch(function (error) {
      console.error(error);
      return res.json({
        message: "Update has failed",
        return: req.body
      })
    })
  }
}

export default PointsController;