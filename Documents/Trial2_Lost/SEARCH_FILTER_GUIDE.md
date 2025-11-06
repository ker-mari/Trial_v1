# Search and Filter Functionality for Code L and Code V Items

## Overview
This implementation adds comprehensive search and filter functionality to the Lost and Found system, allowing users to easily find items based on various criteria.

## Features Implemented

### 1. Backend API Enhancements
- **Enhanced ItemController**: Added search and filter parameters to the `index()` method
- **New Filter Endpoint**: Added `/items-filters` endpoint to get available categories and locations
- **Search Parameters**: 
  - `search`: Search across description, category, location, and item number
  - `type`: Filter by Code L (regular) or Code V (valuable) items
  - `category`: Filter by specific item category
  - `location`: Filter by location where item was found

### 2. Frontend Components
- **SearchFilter Component**: New reusable component for search and filter UI
- **Enhanced ViewItems**: Integrated search and filter functionality
- **Updated App.jsx**: Added search and filter state management

### 3. Item Classification
- **Code L Items**: Regular items (`is_valuable = false`)
- **Code V Items**: Valuable items (`is_valuable = true`)
- **Visual Indicators**: Color-coded badges to distinguish between Code L and Code V items

## API Endpoints

### GET /api/items
Enhanced with query parameters:
- `?search=term` - Search across multiple fields
- `?type=code_l` - Filter for regular items only
- `?type=code_v` - Filter for valuable items only
- `?category=Electronics` - Filter by specific category
- `?location=Library` - Filter by location

### GET /api/items-filters
Returns available filter options:
```json
{
  "success": true,
  "data": {
    "categories": ["Electronics", "Clothing", "Books", ...],
    "locations": ["Library", "Cafeteria", "Gym", ...]
  }
}
```

## Usage Instructions

### For Users
1. **Search**: Type keywords in the search bar to find items by description, category, location, or item number
2. **Filter by Type**: 
   - Select "Code L (Regular Items)" for non-valuable items
   - Select "Code V (Valuable Items)" for valuable items like electronics, jewelry, etc.
3. **Filter by Category**: Choose specific item categories from the dropdown
4. **Filter by Location**: Select where items were found
5. **Clear Filters**: Use the "Clear All Filters" button to reset all filters

### Visual Indicators
- **Green Badge (Code L)**: Regular items that are not considered valuable
- **Red Badge (Code V)**: Valuable items that require special handling
- **Active Filter Tags**: Show currently applied filters with color coding

## Technical Implementation

### Backend Changes
1. **ItemController.php**: Enhanced `index()` method with search and filter logic
2. **API Routes**: Added new filter endpoint
3. **Database Queries**: Optimized queries with proper indexing considerations

### Frontend Changes
1. **SearchFilter.jsx**: New component with modern UI design
2. **ViewItems.jsx**: Integrated search and filter functionality
3. **App.jsx**: Added state management for filtered items
4. **api.js**: Enhanced API service with search parameters

### Styling
- Responsive design that works on all screen sizes
- Accessible color scheme with proper contrast
- Modern UI with smooth transitions and hover effects
- Consistent with existing application design language

## Benefits
1. **Improved User Experience**: Users can quickly find specific items
2. **Efficient Item Management**: Officers can filter items by type and category
3. **Better Organization**: Clear distinction between regular and valuable items
4. **Scalability**: System can handle large numbers of items efficiently
5. **Accessibility**: Designed with elderly users in mind with large fonts and clear indicators

## Future Enhancements
- Advanced search with date ranges
- Sorting options (by date, category, etc.)
- Saved search preferences
- Export filtered results
- Real-time search suggestions