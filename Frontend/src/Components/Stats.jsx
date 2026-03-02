export default function Stats() {
    // Example data, you can replace with props or API data
    const statsData = [
        { label: "Users", value: 1250 },
        { label: "Videos Generated", value: 432 },
        { label: "Community Projects", value: 87 }, // third stat
    ];

    return (
        <div className="stats mt-10 flex flex-col sm:flex-row justify-between gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
            {statsData.map((stat, index) => (
                <div
                    key={index}
                    className="flex-1 bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200 flex flex-col items-center"
                >
                    <p className="text-3xl font-bold text-blue-600">{stat.value}+</p>
                    <p className="text-sm font-medium text-gray-600 mt-1">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}
