import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const BlogContext = createContext();

export const useBlog = () => {
    return useContext(BlogContext);
};


export const BlogProvider = ({ children }) => {
    const { token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [currentPost, setCurrentPost] = useState(null); // Add state for a single post
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const getAdminPosts = useCallback(async () => { /* ... */ }, [token, API_BASE_URL]);
    const deletePost = useCallback(async (postId) => { /* ... */ }, [token, API_BASE_URL]);

    // NEW: Get a single post for editing
    const getPostById = useCallback(async (postId) => {
        if (!token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Note: We need a new backend endpoint for this
            const { data } = await axios.get(`${API_BASE_URL}/blog/posts/admin/${postId}`, config);
            setCurrentPost(data.data);
            return data.data;
        } catch (error) {
            toast.error("Failed to fetch post.");
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    // NEW: Create a new post
    const createPost = useCallback(async (postData) => {
        if (!token) return null;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.post(`${API_BASE_URL}/blog/posts/admin`, postData, config);
            toast.success("Post created successfully!");
            return data.data; // Return the new post
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create post.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);

    // NEW: Update an existing post
    const updatePost = useCallback(async (postId, postData) => {
        if (!token) return null;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.put(`${API_BASE_URL}/blog/posts/admin/${postId}`, postData, config);
            toast.success("Post updated successfully!");
            return data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update post.");
            return null;
        } finally {
            setLoading(false);
        }
    }, [token, API_BASE_URL]);
    
    const value = {
        posts,
        currentPost, // Add currentPost
        loading,
        getAdminPosts,
        getPostById, // Add getPostById
        createPost,  // Add createPost
        updatePost,  // Add updatePost
        deletePost,
    };

    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    );
};