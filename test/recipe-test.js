const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Recipes', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('should list recipes on GET', function() {
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
				expect(res.body.length).to.be.above(0);
				res.body.forEach(function(item) {
					expect(item).to.be.a('object');
					expect(item).to.have.all.keys('id', 'name', 'ingredients');
				});
			});
	});

	it('should add a recipe on POST', function() {
		const newRecipe = {
			name: 'coffee', ingredients: ['ground coffee', 'hot water']};
		return chai.request(app)
		.post('/recipes')
		.send(newRecipe)
		.then(function(res) {
			res.should.have.status(201);
			res.shouls.be.json;
			res.body.should.be.a('object');
			res.body.should.include.keys('id', 'name', 'ingredients');
			res.body.name.should.equal(newRecipe.name);
			res.body.ingredients.should.be.a('array');
			res.body.ingridients.should.include.members(newRecipe,ingridients);
		});
	});

	it('should update recipes on PUT', function() {

		const updateData = {
			name: 'foo',
			ingridients: ['bizz', 'bang']
		};

		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			updateData.id = res.body[0].id;

			return chai.request(app)
			.put(`/recipes/${updateData.id}`)
			.send(updateData)
		})
		.then(function(res) {
			 res.should.have.status(204);
		});
	});

	it('should delete recipes on DELETE', function() {
		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			return chai.request(app)
			.delete(`/recipes/${res.body[0].id}`)
		})
		.then(function(res) {
			res.should.have.status(204);
		});
	});
});