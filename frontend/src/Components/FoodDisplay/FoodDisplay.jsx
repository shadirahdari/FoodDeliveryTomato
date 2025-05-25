import React, { useContext } from 'react'
import './Fooddisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext)

  // Filter food items based on category
  const filteredFoodList = category === "All" 
    ? food_list 
    : food_list.filter(item => item.category === category);

  return (
    <div className='food-display' id='food-display'>
      <h2>
        {category === "All" 
          ? "Top dishes near you" 
          : `${category} dishes for you`}
      </h2>
      <div className="food-display-list">
        {filteredFoodList.map((item, index) => {
          return (
            <FoodItem 
              key={index} 
              id={item._id} 
              name={item.name} 
              description={item.description} 
              price={item.price} 
              image={item.image}
            />
          );
        })}
      </div>
      {filteredFoodList.length === 0 && (
        <div className="no-items-message">
          No {category} dishes available at the moment
        </div>
      )}
    </div>
  )
}

export default FoodDisplay
