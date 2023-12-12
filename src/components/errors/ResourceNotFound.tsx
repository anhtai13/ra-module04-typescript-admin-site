interface ResourceNotFoundProps {
  resourceName: string;
}

const ResourceNotFound: React.FC<ResourceNotFoundProps> = ({
  resourceName,
}) => {
  return <div className="text-danger">Không tìm thấy {resourceName}</div>;
};

export default ResourceNotFound;
