const fs = require('fs/promises');
const path = require('path');

module.exports = class Contenedor{ 
	constructor(fileName){
		this.fileName = path.resolve(fileName);
	}

	async save(newData = {}){
		let id = 1;
   
        try{
            let fileData;
            const data = await fs.readFile(this.fileName, { encoding: 'utf-8' });    
            
            fileData = JSON.parse(data);
            fileData.forEach((element) => {
                if(element.id >= id){
                    id = element.id + 1;
                }
            });
            fileData.push({id, ...newData});

            await fs.writeFile(this.fileName, JSON.stringify(fileData, null, 4));
        } catch {
			if(newData){
				await fs.writeFile(this.fileName, JSON.stringify([{ id, ...newData}], null, 4));  
			} else {
				throw new Error('No se puede agregar un objeto vacío');
			}              
        }   
        return id;
	}

	async getById(queryId){
		try {
			const data = await fs.readFile(this.fileName, { encoding: 'utf-8' });
			let fileData = JSON.parse(data);
			let result = fileData.find(item => item.id === parseInt(queryId));
			return result || null;
		} catch (error){
			throw new Error(error.message);
		}
	}

	async getAll(){
		try {
			const data = await fs.readFile(this.fileName, { encoding: 'utf-8' });
			return JSON.parse(data);
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async deleteById(queryId){
		try {
			const data = await fs.readFile(this.fileName, { encoding: 'utf-8' });
			let fileData = JSON.parse(data);
			let filteredData = fileData.filter(item => item.id !== parseInt(queryId));
			await fs.writeFile(this.fileName, JSON.stringify(filteredData, null, 4));
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async deleteAll(){
		try {
			await fs.writeFile(this.fileName, JSON.stringify([], null, 4));
		} catch (error) {
			throw new Error(error.message);
		}
	}
}