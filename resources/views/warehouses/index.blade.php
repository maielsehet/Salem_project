<!DOCTYPE html>
<html>
<head>
    <title>Warehouses List</title>
</head>
<body>
    <h1>Warehouses</h1>
    <a href="{{ route('warehouses.create') }}">+ Add Warehouse</a>

    @if (session('success'))
        <p style="color: green;">{{ session('success') }}</p>
    @endif

    <table border="1" cellpadding="10">
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Branch ID</th>
            <th>Location</th>
            <th>Actions</th>
        </tr>
        @foreach ($warehouses as $warehouse)
            <tr>
                <td>{{ $warehouse->id }}</td>
                <td>{{ $warehouse->name }}</td>
                <td>{{ $warehouse->branch_id }}</td>
                <td>{{ $warehouse->location }}</td>
                <td>
                    <a href="{{ route('warehouses.edit', $warehouse->id) }}">Edit</a>
                    <form action="{{ route('warehouses.destroy', $warehouse->id) }}" method="POST" style="display:inline;">
                        @csrf
                        @method('DELETE')
                        <button type="submit" onclick="return confirm('Delete this warehouse?')">Delete</button>
                    </form>
                </td>
            </tr>
        @endforeach
    </table>
</body>
</html>
