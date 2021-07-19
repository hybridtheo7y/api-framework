import { allure } from 'allure-mocha/runtime';
import CoreApi from '../http/CoreApi';
import { assert } from 'chai';
import { AxiosResponse } from 'axios';
import { Cat } from '../../@types/common';

export default class Steps {
  public static common = {
    stepGetAllByLetter: Steps.getAllByLetter,
    stepGetCatById: Steps.getCatById,
    stepRemoveCat: Steps.removeCat,
    equal: Steps.equal,
  };


  private static async getAllByLetter(): Promise<AxiosResponse<{ groups: { title: string; cats: Cat[] }[] }>> {
    return await allure.step(`выполнен запрос GET /getAllByLetter c параметром limit=2`, async () => {
      const msg = `Используя метод GET /getAllByLetter c параметром limit=2 получаем список котов`
      console.info('тест 1 🚀:',  msg);
      const response = await CoreApi.getAllByLetter();
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('attachment', data, 'application/json');

      return response;
    });
  }

  private static async getCatById(id: number): Promise<AxiosResponse<{ cat: Cat }>> {
    return await allure.step(`выполним запрос GET /get-by-id c параметром ${id}`, async () => {
      const msg1 = `Получен случайный id= ${id} `
      console.info('тест 2 🚀:',  msg1);
      const msg2 = `Выполним запрос GET /get-by-id и проверим действительно ли кот со случайным id= ${id} существует`
      console.info('тест 2 🚀:',  msg2);
      const response = await CoreApi.getCatById(id);
      const data = JSON.stringify(response.data, null, 2);
      console.info('тест 2 🚀:', 'Получен ответ на запрос GET /get-by-id:\n', data);
      allure.attachment('attachment', data, 'application/json');
      const CatName = response.data.cat.name;
      console.info('тест 2 🚀:', 'По полученному ID найден кот: ', CatName);
      return response;
    });
  }

  private static async removeCat(id: number): Promise<AxiosResponse<Cat>> {
    return await allure.step(`выполнен запрос DELETE cats/{catID}/remove`, async () => {
      const response = await CoreApi.removeCat(id);
      const msg = `Используя метод DELETE cats/{catID}/remove удаляем кота c id = ${id}`
      console.info('тест 3 🚀:',  msg);
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('attachment', data, 'application/json');
      return response;
    });
  }

  private static async equal(exp: any, act: any) {
    return await allure.step('выполнена проверка соответствия значений', () => {
      allure.attachment('expected', exp, 'text/plain');
      allure.attachment('actual', act, 'text/plain');
      assert.equal(exp, act, 'Значения не соответствуют');
    });
  }
}
