import React from 'react'
import Products from './products/page'
import Header from './components/Header'


interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  const { search } = await searchParams;
  return (
    <div>
      <Header />
      <Products search={search} />
    </div>
  );
};

export default  page