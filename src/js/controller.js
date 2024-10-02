import * as model from './model.js';
import recipeView from './Views/recipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchView from './Views/searchView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
import bookmarkView from './Views/bookmarkView.js';
import addRecipeView from './Views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';


if(module.hot){
  module.hot.accept();
}




// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes =async function(){
  try{
    const id = window.location.hash.slice(1);
    

    if(!id) return;
    recipeView.renderSpinner();

    //0.Update results view to mark selected search result
    resultsView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);
    //1.Loading recipe
    await model.loadRecipe(id);
    
   
    //2.rendering recipe
    recipeView.render(model.state.recipe);
    

    
   
  }catch (err){
    recipeView.renderError();
  }
};

const controlSearchRecipes = async function(){
  try{
    resultsView.renderSpinner();
    //1.Get search query
    const query = searchView.getQuery();
    if(!query) return;

    //2.Load search resul;
    await model.loadSerachResults(query);

    //3.render result
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    //4. Render initial pagination buttons
    paginationView.render(model.state.search)
  }  catch(err){
    console.log(err);
  }
};
const controlPagination = function(goToPage){
    //3.render new result
    resultsView.render(model.getSearchResultPage(goToPage));

    //4. Render new pagination buttons
    paginationView.render(model.state.search)
};

const controlServings = function(newServings){
  //update the servings
  model.updateServings(newServings);

  //update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function(){
  //1.Add/remove bookmark
  if(!model.state.recipe.bookmarked)model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2. Update recipe view
  recipeView.update(model.state.recipe)

  //3.render bookmarks
  bookmarkView.render(model.state.bookmarks)
}

const controlBookmarks = function(){
  bookmarkView.render(model.state.bookmarks)
}
const controlAddRecipe = async function(newRecipe){
  try
  {
    //Show loading spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe data
  await model.uploadRecipe(newRecipe);
  console.log(model.state.recipe);

    // Render Recipe
    recipeView.render(model.state.recipe);

    //Close the form
    setTimeout(function(){
      addRecipeView.toggleWindow()},MODAL_CLOSE_SEC*1000
    )
    //success message
    addRecipeView.renderMessage();

    //render bookmark view
    bookmarkView.render(model.state.bookmarks);

    //Change ID in URL
    window.history.pushState(null,'',`#${model.state.recipe.id}`)
}catch(err){
  console.log(err);
  addRecipeView.renderError(err.message)
}
}
const init = function(){
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)

  
  // fetchRecipe();

  }
init();

const clearBookmarks = function(){
  localStorage.clear('bookmarks')
}
// clearBookmark();