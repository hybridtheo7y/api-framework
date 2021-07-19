import { assert } from 'chai';
import CoreApi from '../src/http/CoreApi';
import Steps from '../src/steps/HwSteps';
import { allure } from 'allure-mocha/runtime';

const getRandom = (max: number) => Math.floor(Math.random() * max);


describe('Удаление случайного кота', async () => {
  let rand_ID = null;
  let Id_Array = [];

  it('Получение списка котов методом GET /getAllByLetter ', async () => {
    const response = await Steps.common.stepGetAllByLetter();
    let i = 0;
      for (i = 0; i < response.data.groups.length; i++) {
        Id_Array.push(response.data.groups[i].cats[0].id)
        }
    const status: string = '200';
    await allure.step(
      'выполнена проверка соответствия значения статуса ответа с ожидаемым',
      async () => await Steps.common.equal(response.status.toString(), status)
    );

  });

  it('Выдергиваем рандомное ID и проверяем наличие такого кота', async () => {
    const random_Number = getRandom(Id_Array.length);
    rand_ID = Id_Array[random_Number]
    const response = await Steps.common.stepGetCatById(rand_ID);
    const status: string = '200';
    await allure.step(
      'Выполнена проверка соответствия значения статуса ответа с ожидаемымм',
      async () => await Steps.common.equal(response.status.toString(), status)
    );
  });

  it('Удаление найденного кота', async () => {
    const response = await Steps.common.stepRemoveCat(rand_ID);
    const status: string = '200';
    await allure.step(
      'Выполнена проверка соответствия значения статуса ответа с ожидаемымм',
      async () => await Steps.common.equal(response.status.toString(), status)
    );


  });
  it("Проверка того, что кот удален", async () => {
    const status: string = '404';
    const response = await CoreApi.removeCat(rand_ID);
    const msg = `Тест 4 🚀: При попытке повторно удалить кота c id = ${rand_ID} отобразился статус ${response.status}, следовательно кот удален`;
    await allure.step(
      'Выполнена проверка соответствия значения статуса ответа 404',
      async () => await Steps.common.equal(response.status.toString(), status)
    );
    console.log(msg);

  });
});