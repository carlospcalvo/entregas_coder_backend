const Contenedor = require('./Contenedor');

const test = new Contenedor('productos.txt');

let dummyData = [
    {
        title: 'Macbook Air 2020 M1',
        price: '1000',
        thumbnail: 'https://placekitten.com/200/400'
    },
    {
        title: 'Macbook Pro 2020 M1',
        price: '1200',
        thumbnail: 'https://placekitten.com/200/300'
    },
    {
        title: 'Macbook Pro 2019 Intel',
        price: '1100',
        thumbnail: 'https://placekitten.com/300/400'
    }
]

executeTests(dummyData)

async function executeTests(dummyData){
    //save
    await testSave(dummyData);
    //get by id
    await testGetById(3, 300);
    //get all
    await testGetAll();
    //delete
    await testDeleteById(2);
    //delete all
    await testDeleteAll();
}

async function testSave(dummyData){
    const saveResult0 = await test.save(dummyData[0]);
    console.log('[ save() ] id item creado: ', saveResult0);
    const saveResult1 = await test.save(dummyData[1]);
    console.log('[ save() ] id item creado: ', saveResult1);
    const saveResult2 = await test.save(dummyData[2]);
    console.log('[ save() ] id item creado: ', saveResult2);  
}

async function testGetById(ok, notOk){
    const getByIdResultOK = await test.getById(parseInt(ok));
    console.log(`[ getById(${ok}) ]`, getByIdResultOK);
    const getByIdResultNotFound = await test.getById(parseInt(notOk));
    console.log(`[ getById(${notOk}) ]`, getByIdResultNotFound);
}

async function testGetAll(){
    const getAllResult = await test.getAll();
    console.log('[ getAll() ]', getAllResult);
}

async function testDeleteById(id){
    await test.deleteById(id);
    const deleteByIdResult = await test.getById(2);
    console.log(`[ deleteById(${id}) ]`, deleteByIdResult);
}

async function testDeleteAll(){
    await test.deleteAll();
    const deleteAllResult = await test.getAll();
    console.log('[ deleteAll() ]', deleteAllResult);
}