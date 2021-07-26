import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import LikeApi from '../src/http/LikeApi';
import { allure } from 'allure-mocha/runtime';

const getRandom = (max: number) => Math.floor(Math.random() * max);
const add_of_likes: number = 3;
const add_of_dislikes: number = 2;

describe('Тест-сьют проверки лайков/дизлайков', async () => {

  let rand_ID = null;
  let CatName = null;
  let Id_Array = [];
  let Num_of_likes = null;
  let Num_of_dislikes = null;

  before( () => {
    console.log('Начало тестирования');
  });
  afterEach(() => {
    console.log('Прогон тест-кейса завершен!\n');
  });
  beforeEach('Выдергиваем id случ. котика из списка полученного методом GET cats/allByLetter', async () => {
    const response = await CoreApi.getAllByLetter();
    for (let i = 0; i < response.data.groups.length; i++) {
      Id_Array.push(response.data.groups[i].cats[0].id)
    }
    const random_Number = getRandom(Id_Array.length);
    rand_ID = Id_Array[random_Number];
    const msg = `Из списка полученного методом GET cats/allByLetter вытащили случайный id = ${rand_ID}\n `;
    console.log(msg);

  });

  it('Проверка лайков', async () => {
    await allure.step(`выполним запрос GET cats/get-by-id c параметром ${rand_ID}`, async () => {
      const msg = `Выполним запрос GET /get-by-id и проверим действительно ли кот с id= ${rand_ID} существует`
      console.info('тест 1 🚀:',  msg);
      const response = await CoreApi.getCatById(rand_ID);
      assert.ok(response.status === 200, 'Неверный статус ответа, кот не найден!')
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('attachment', data, 'application/json');
      CatName = response.data.cat.name;
      console.info('тест 1 🚀:', 'По полученному ID найден кот: ', CatName);
    });

    await allure.step(`Сохраним лайки кота`, async () => {
      const response = await CoreApi.getCatById(rand_ID);
      assert.ok(response.status === 200, 'Неверный статус ответа, кот не найден!')
      Num_of_likes = response.data.cat.likes
      const msg = `У кота ${CatName}  - ${Num_of_likes} лайка(ов)`
      console.info('тест 2 🚀:', msg);
      assert.equal(response.data.cat.likes,  Num_of_likes, `Значения не совпадают! `);
    });


    await allure.step(`Добавление лайков коту: ${rand_ID}`,
      async () => {
        console.info('Тест 3 🚀', `Выполняем в цикле запрос POST cats/{catId}/likes и ставим ${add_of_likes} лайка(ов)`);
        for (let i = 0; i < add_of_likes - 1; i++) {
          await LikeApi.likes(rand_ID, { like: true, dislike: null});
        }
        const response2 = await LikeApi.likes(rand_ID, { like: true, dislike: null});
        allure.testAttachment('Информация о коте после добавления лайков', JSON.stringify(response2.data, null, 2), 'application/json',);
        assert.ok(response2.status === 200, );
      });

    await allure.step(` Проверка количества лайков у кота: ${CatName}`,
      async () => {
        console.info('Тест 4 🚀', 'Выполняем GET запрос /getCatById, чтобы проверить текущее кол-во лайков');
        const response = await CoreApi.getCatById(rand_ID);
        const msg = `Текущее кол-во лайков у кота ${CatName}  = ${response.data.cat.likes} и ожидаемое кол-во ${add_of_likes + Num_of_likes}`
        console.info('Тест 4 🚀', msg);
        assert.ok(response.status === 200, );
        assert.equal(response.data.cat.likes,  add_of_likes + Num_of_likes, `Значения не совпадают!`);
      });
  });

  it('Проверка дизлайков', async () => {
    await allure.step(`выполним запрос GET cats/get-by-id c параметром ${rand_ID}`, async () => {
      const msg = `Выполним запрос GET /get-by-id и проверим действительно ли кот с id= ${rand_ID} существует`
      console.info('тест 1 🚀:',  msg);
      const response = await CoreApi.getCatById(rand_ID);
      assert.ok(response.status === 200, 'Неверный статус ответа, кот не найден!')
      const data = JSON.stringify(response.data, null, 2);
      allure.attachment('attachment', data, 'application/json');
      CatName = response.data.cat.name;
      console.info('тест 1 🚀:', 'По полученному ID найден кот: ', CatName);
    });

    await allure.step(`Сохраним дизлайки кота`, async () => {
      const response = await CoreApi.getCatById(rand_ID);
      assert.ok(response.status === 200, 'Неверный статус ответа, кот не найден!')
      Num_of_dislikes = response.data.cat.dislikes
      const msg = `У кота ${CatName}  - ${Num_of_dislikes} дизлайка(ов)`
      console.info('тест 2 🚀:', msg);
      assert.equal(response.data.cat.dislikes,  Num_of_dislikes, `Значения не совпадают! `);
    });


    await allure.step(`Добавление дизлайков коту: ${rand_ID}`,
      async () => {
        console.info('Тест 3 🚀', `Выполняем в цикле запрос POST cats/{catId}/likes и ставим ${add_of_dislikes} дизлайка(ов)`);
        for (let i = 0; i < add_of_dislikes - 1; i++) {
          await LikeApi.likes(rand_ID, { like: null, dislike: true});
        }
        const response = await LikeApi.likes(rand_ID, { like: null, dislike: true});
        allure.testAttachment('Информация о коте после добавления дизлайков', JSON.stringify(response.data, null, 2), 'application/json',);
        assert.ok(response.status === 200, );
      });

    await allure.step(` Проверка количества дизлайков у кота: ${CatName}`,
      async () => {
        console.info('Тест 4 🚀', 'Выполняем GET запрос /getCatById, чтобы проверить текущее кол-во дизлайков');
        const response = await CoreApi.getCatById(rand_ID);
        const msg = `Текущее кол-во дизлайков у кота ${CatName}  = ${response.data.cat.dislikes} и ожидаемое кол-во ${add_of_dislikes + Num_of_dislikes}`
        console.info('Тест 4 🚀', msg);
        assert.ok(response.status === 200, );
        assert.equal(response.data.cat.dislikes,  add_of_dislikes + Num_of_dislikes, `Значения не совпадают!`);
      });
  });

});