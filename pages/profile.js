import React from 'react'

import { withData } from '../contexts/Data'
import Card from "../components/Card"

import "../assets/styles/layout.scss"

const UserPosts = (props) => {
    return (
        <div>
            <ul className='FlexGrid'>
                {
                    props.posts.map(post => (
                        <li key={post.id} className='FlexGridItem'>
                            <Card {...post} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default withData(UserPosts, {
    keyName: "posts",
    url: "http://jsonplaceholder.typicode.com/posts?userId=%(userId)s"
})
