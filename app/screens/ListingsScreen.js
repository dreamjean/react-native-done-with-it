import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import listingsApi from "../api/listings";
import { ActivityIndicator, Button, Card, Category } from "../components";
import { Text, View } from "../components/styles";
import categories from "../data/categories";
import useApi from "../hooks/useApi";
import routes from "../navigation/routes";

const newCategory = { label: "All", value: 0 };
const newCategories = [newCategory, ...categories];

const ListingsScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState(newCategory);

  const { data: listings, error, loading, request: loadingListings } = useApi(
    listingsApi.getListings
  );

  useEffect(() => {
    loadingListings();
  }, []);

  const fetchData = () => {
    let data = [...listings];
    if (selectedCategory.value !== 0)
      data = listings.filter(
        (listing) => listing.categoryId === selectedCategory.value
      );
    return data;
  };

  return (
    <View container light>
      <ActivityIndicator visible={loading} />
      <CategoryBar>
        <Categories horizontal showsHorizontalScrollIndicator={false}>
          {newCategories.map((category) => (
            <Category
              key={category.value}
              title={category.label}
              selected={selectedCategory.label === category.label}
              onPress={() => setSelectedCategory(category)}
            />
          ))}
        </Categories>
      </CategoryBar>
      {error && (
        <>
          <Text
            body1
            marginTop={10}
            center
          >{`Couldn't retrieve the listings.`}</Text>
          <Button
            title="Retry"
            primary
            marginVertical={8}
            onPress={loadingListings}
          />
        </>
      )}

      <FlatList
        data={fetchData()}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            subTitle={"$" + item.price}
            image={item.images[0].url}
            thumbnaiUrl={item.images[0].thumbnailUrl}
            onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="dark" />
    </View>
  );
};

const Categories = styled.ScrollView``;

const CategoryBar = styled.View`
  ${({ theme: { space } }) => ({
    paddingTop: space.s3,
    paddingBottom: space.s1,
  })}
`;

const FlatList = styled.FlatList``;

export default ListingsScreen;
