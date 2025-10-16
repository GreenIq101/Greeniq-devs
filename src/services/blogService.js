import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const blogsCollection = collection(db, 'blogs');

// Add a new blog post
export const addBlog = async (blogData) => {
  try {
    const docRef = await addDoc(blogsCollection, {
      ...blogData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding blog:', error);
    throw error;
  }
};

// Get all blog posts
export const getBlogs = async () => {
  try {
    const q = query(blogsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const blogs = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    return blogs;
  } catch (error) {
    console.error('Error getting blogs:', error);
    throw error;
  }
};

// Update a blog post
export const updateBlog = async (id, blogData) => {
  try {
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, {
      ...blogData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};

// Delete a blog post
export const deleteBlog = async (id) => {
  try {
    await deleteDoc(doc(db, 'blogs', id));
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
};