# DataTable Pagination Usage Guide

## 🎉 **Pagination Implementation Complete!**

The DataTable component now has full server-side pagination support with URL parameter synchronization.

## ✅ **Features Implemented**

### **1. Server-Side Pagination**

- Automatic URL parameter management (`page` and `limit`)
- Server-side data fetching based on URL parameters
- Manual pagination control (disables client-side pagination)

### **2. Enhanced UI Features**

- **Tracking Number**: Shows only first 6 characters
- **From/To Cities**: Displays pickup city → delivery city with arrow
- **Enhanced Delivery Display**: Color-coded status indicators with visual timeline
- **Responsive Design**: Mobile-friendly pagination controls

### **3. URL Parameter Management**

- `page`: Current page number (1-based)
- `limit`: Number of items per page (10, 20, 30, 40, 50)
- Automatic URL updates when pagination changes
- Direct URL navigation support

## 📖 **Usage Example**

### **Component Usage**

```tsx
import { DataTable } from '@/components/data-table';

// Example server component or page
export default async function ParcelPage({
   searchParams,
}: {
   searchParams: { page?: string; limit?: string };
}) {
   const page = Number(searchParams.page) || 1;
   const limit = Number(searchParams.limit) || 10;

   // Fetch data from your API with pagination
   const response = await fetch(`/api/parcels?page=${page}&limit=${limit}`);
   const { data, pagination } = await response.json();

   return (
      <div className="container mx-auto py-6">
         <h1 className="mb-6 text-2xl font-bold">Parcel Management</h1>
         <DataTable
            data={data}
            paginationInfo={{
               page: pagination.page,
               total: pagination.total,
               pages: pagination.pages,
            }}
         />
      </div>
   );
}
```

### **Expected API Response Format**

```json
{
   "data": [
      {
         "id": "1",
         "parcelType": "Standard",
         "trackingNumber": "TRK123456789",
         "status": "IN_TRANSIT",
         "estimatedDelivery": "2025-07-25T14:30:00Z",
         "recipient": {
            "name": "John Doe",
            "phone": "+1234567890"
         },
         "sender": {
            "name": "Jane Smith",
            "phone": "+0987654321"
         },
         "pickupAddress": {
            "city": "New York"
         },
         "deliveryAddress": {
            "city": "Boston"
         }
      }
   ],
   "pagination": {
      "page": 1,
      "total": 100,
      "pages": 10
   }
}
```

### **Backend Implementation Example**

```typescript
// Example API endpoint (Next.js API route)
export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const page = Number(searchParams.get('page')) || 1;
   const limit = Number(searchParams.get('limit')) || 10;
   const offset = (page - 1) * limit;

   // Your database query with pagination
   const [data, total] = await Promise.all([
      db.parcel.findMany({
         take: limit,
         skip: offset,
         include: {
            recipient: true,
            sender: true,
            pickupAddress: true,
            deliveryAddress: true,
         },
      }),
      db.parcel.count(),
   ]);

   const pages = Math.ceil(total / limit);

   return Response.json({
      data,
      pagination: {
         page,
         total,
         pages,
      },
   });
}
```

## 🎨 **Visual Features**

### **Estimated Delivery Display**

- 🔴 **Red dot**: Overdue deliveries
- 🟠 **Orange dot**: Due today
- 🟡 **Yellow dot**: Due tomorrow
- 🔵 **Blue dot**: Due within 3 days
- 🟢 **Green dot**: Due later

### **Column Features**

- **Tracking Number**: Displays first 6 characters (e.g., "TRK123" from "TRK123456789")
- **From/To Route**: Shows "New York ↓ Boston" format
- **Status**: Color-coded badges with icons
- **Delivery Date**: Smart formatting with relative time indicators

### **Pagination Controls**

- **Page Size Selector**: 10, 20, 30, 40, 50 items per page
- **Navigation Buttons**: First, Previous, Next, Last page
- **Page Info**: "Page X of Y" display
- **Record Count**: "Showing X of Y total records"

## 🔧 **How It Works**

1. **URL Parameters**: The component reads `page` and `limit` from URL search parameters
2. **State Management**: Internal pagination state syncs with `paginationInfo` prop
3. **Navigation**: When user clicks pagination controls, URL updates with new parameters
4. **Server Fetch**: Parent component re-fetches data based on new URL parameters
5. **Re-render**: Component receives new data and pagination info

## 📱 **Mobile Responsive**

- Condensed pagination controls on mobile
- Touch-friendly button sizes
- Adaptive column visibility
- Drawer-based detail view

## 🚀 **Performance Optimizations**

- Server-side pagination reduces client memory usage
- URL parameter caching enables browser back/forward
- Optimized re-renders with React.useCallback
- Lazy loading support ready

## 🔗 **URL Examples**

- `/parcels` - Default (page 1, limit 10)
- `/parcels?page=2` - Page 2 with default limit
- `/parcels?page=3&limit=20` - Page 3 with 20 items per page
- `/parcels?page=1&limit=50` - Page 1 with 50 items per page

The pagination is now fully functional and ready for production use! 🎉
