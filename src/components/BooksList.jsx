"use client";

import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://library-api-roberto-nieves-projects.vercel.app/api/books"
        );

        const authorsResponse = await axios.get(
          "https://library-api-roberto-nieves-projects.vercel.app/api/authors"
        );

        setBooks(response.data);
        setAuthors(authorsResponse.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const authorMap = authors.reduce((acc, author) => {
    acc[author.id] = author;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        Library Books
      </h1>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {books.length > 0 ? (
            <>
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow p-4"
                >
                  <div className="h-40 w-full overflow-hidden rounded-md mb-4">
                    <Image
                      src={`/images/book${book.id}.jpg`}
                      width={300}
                      height={70}
                      alt={book.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="mb-2">
                    <a
                      className="text-xl font-semibold cursor-pointer text-white"
                      href={`https://library-api-coral.vercel.app/api/books/${book.id}`}
                    >
                      {book.title}
                    </a>
                  </div>
                  <a
                    className="text-gray-600 cursor-pointer"
                    href={`https://library-api-coral.vercel.app/api/authors/${book.authorId}`}
                  >
                    Author: {authorMap[book.authorId]?.name || "Unknown"}
                  </a>
                  <p
                    className={`mt-2 ${
                      book.available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {book.available ? "Available" : "Unavailable"}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <p className="text-center text-gray-500">No books available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
