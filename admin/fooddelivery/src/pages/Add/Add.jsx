import React, { useState, useEffect } from 'react'
import './Add.css'
import { assets } from '../../assets/asset'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

const Add = () => {
  const navigate = useNavigate()
  const url = "https://fooddeliverytomato-2.onrender.com"
  const [image, setImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert("Please login first")
      navigate('/login')
    }
  }, [navigate])

  const getToken = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert("Please login first")
      navigate('/login')
      return null
    }
    return token
  }

  const onChangeHandeler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!image) {
      alert("Please select an image before submitting.")
      return
    }

    const token = getToken()
    if (!token) return

    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)
    formData.append("image", image)

    try {
      setLoading(true)
      const response = await axios.post(`${url}/api/food/add`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Salad"
        })
        setImage(false)
        alert("Product added successfully!")
      } else {
        throw new Error(response.data.message || "Failed to add product")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      if (error.response?.status === 403) {
        alert("Access denied. Please make sure you are logged in as an admin.")
        navigate('/login')
      } else {
        alert(error.response?.data?.message || error.message || "Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.add_icon_white} alt="upload preview" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden required />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input onChange={onChangeHandeler} value={data.name} type="text" name='name' placeholder='Type here' required />
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandeler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category</p>
            <select onChange={onChangeHandeler} value={data.category} name="category" required>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandeler} value={data.price} type="number" name='price' placeholder='20' required />
          </div>
        </div>
        <div className=''>
          <button type='submit' className='add-btn' disabled={loading}>
            {loading ? 'Adding...' : 'ADD'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
